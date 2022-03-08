import { Component, OnInit, Inject, OnDestroy, Injectable, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { HierarchyModel, MenuModel, ServicesModel, StoresModel, SubHierarchyModel, TimingsModel } from 'src/app/shared/app-interfaces';
import { StoreService } from 'src/app/services/store.service';
import { MenuService } from 'src/app/services/menu.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MasterServicesService } from 'src/app/services/master-service.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

// export interface TodoItemNode {
//   children: TodoItemNode[];
//   item: string;
// }

// /** Flat to-do item node with expandable and level information */
// export interface TodoItemFlatNode {
//   item: string;
//   level: number;
//   expandable: boolean;
// }

// /**
//  * The Json object for to-do list data.
//  */
// const TREE_DATA = {
//   Groceries: {
//     'Almond Meal flour': null,
//     'Organic eggs': null,
//     'Protein Powder': null,
//     Fruits: {
//       Apple: null,
//       Berries: ['Blueberry', 'Raspberry'],
//       Orange: null,
//     },
//   },
//   Reminders: ['Cook dinner', 'Read the Material Design spec', 'Upgrade Application to Angular'],
// };

// /**
//  * Checklist database, it can build a tree structured Json object.
//  * Each node in Json object represents a to-do item or a category.
//  * If a node is a category, it has children items and new items can be added under the category.
//  */
// @Injectable({
//   providedIn: 'root'
// })
// export class ChecklistDatabase {
//   dataChange = new BehaviorSubject<TodoItemNode[]>([]);

//   get data(): TodoItemNode[] {
//     return this.dataChange.value;
//   }

//   constructor() {
//     this.initialize();
//   }

//   initialize() {
//     // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
//     //     file node as children.
//     const data = this.buildFileTree(TREE_DATA, 0);

//     // Notify the change.
//     this.dataChange.next(data);
//   }

//   /**
//    * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
//    * The return value is the list of `TodoItemNode`.
//    */
//   buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
//     return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
//       const value = obj[key];
//       const node = {} as TodoItemNode;
//       node.item = key;

//       if (value != null) {
//         if (typeof value === 'object') {
//           node.children = this.buildFileTree(value, level + 1);
//         } else {
//           node.item = value;
//         }
//       }

//       return accumulator.concat(node);
//     }, []);
//   }

//   /** Add an item to to-do list */
//   insertItem(parent: TodoItemNode, name: string) {
//     if (parent.children) {
//       parent.children.push({item: name} as TodoItemNode);
//       this.dataChange.next(this.data);
//     }
//   }

//   updateItem(node: TodoItemNode, name: string) {
//     node.item = name;
//     this.dataChange.next(this.data);
//   }
// }

@Component({
  selector: 'foodbull-copy-menu-tree-modal',
  templateUrl: './copy-menu-tree-modal.component.html',
  styleUrls: ['./copy-menu-tree-modal.component.scss']
})
export class CopyMenuTreeModalComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  menu = {} as MenuModel;
  title = '' as string;
  public isSubmitted = false;
  hierarchyModel = {} as HierarchyModel;
  genericIndex: number = 0;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<SubHierarchyModel, SubHierarchyModel>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<SubHierarchyModel, SubHierarchyModel>();

  /** A selected parent node to be inserted */
  selectedParent: SubHierarchyModel | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<SubHierarchyModel>;

  treeFlattener: MatTreeFlattener<SubHierarchyModel, SubHierarchyModel>;

  dataSource: MatTreeFlatDataSource<SubHierarchyModel, SubHierarchyModel>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<SubHierarchyModel>(true /* multiple */);

  constructor(
    public dialogRef: MatDialogRef<CopyMenuTreeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private storeService: StoreService,
    private menuService: MenuService,
    private alertService: AlertMessageService,
    public utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder,
    private masterServicesService: MasterServicesService,
  ) {
    this.menu = {} as MenuModel;

    this.fg = this.formBuilder.group({
      NameCtrl: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    });

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<SubHierarchyModel>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    // this._database.dataChange.subscribe(data => {
    //   this.dataSource.data = data;
    // });

  }

  ngOnInit() {

    if (!this.utilitiesService.checkNull(this.parameter)
        && !this.utilitiesService.checkNull(this.parameter.regItem)
        && !this.utilitiesService.checkNull(this.parameter.regItem.treeData)) {
          this.hierarchyModel = this.parameter.regItem.treeData;
          this.setIndex(this.hierarchyModel.LstSubHierarchyModel);
          this.dataSource.data = this.hierarchyModel.LstSubHierarchyModel;
          this.title = `Create a duplicate copy of - ${this.hierarchyModel.Name}`;
        }
  }

  setIndex(list: SubHierarchyModel[]) {
    list.forEach(value => {
      value.SNo = this.genericIndex;
      ++this.genericIndex;
      if (value.lstSubItems?.length) {
        this.setIndex(value.lstSubItems);
      }
    });
  }

  getLevel = (node: SubHierarchyModel) => node.level;

  isExpandable = (node: SubHierarchyModel) => node.expandable;

  getChildren = (node: SubHierarchyModel): SubHierarchyModel[] => node.lstSubItems;

  hasChild = (_: number, _nodeData: SubHierarchyModel) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: SubHierarchyModel) => _nodeData.Name === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: SubHierarchyModel, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.Name === node.Name ? existingNode : {} as SubHierarchyModel;
    flatNode.Name = node.Name;
    flatNode.level = level;
    flatNode.IsSelect = node.IsSelect;
    flatNode.RecordType = node.RecordType;
    flatNode.Type = node.Type;
    flatNode.SNo = node.SNo;
    flatNode.expandable = !!node.lstSubItems?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: SubHierarchyModel): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: SubHierarchyModel): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: SubHierarchyModel): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: SubHierarchyModel): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: SubHierarchyModel): void {
    let parent: SubHierarchyModel | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: SubHierarchyModel): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: SubHierarchyModel): SubHierarchyModel | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  // addNewItem(node: TodoItemFlatNode) {
  //   const parentNode = this.flatNodeMap.get(node);
  //   this._database.insertItem(parentNode!, '');
  //   this.treeControl.expand(node);
  // }

  /** Save the node to database */
  // saveNode(node: SubHierarchyModel, itemValue: string) {
  //   const nestedNode = this.flatNodeMap.get(node);
  //   this._database.updateItem(nestedNode!, itemValue);
  // }

  submit(formGroup: FormGroup): void {
    if (this.checklistSelection.selected?.length) {
      this.setSelection(this.hierarchyModel.LstSubHierarchyModel);
      console.log(this.hierarchyModel.LstSubHierarchyModel);
    } else {
      this.alertService.SnackBarWithActions('Select any node', 'Close');
      return;
    }

    this.subscription.push(
      this.menuService.menuCopyHierarchyModel(this.hierarchyModel).subscribe(response => {
        this.alertService.SnackBarWithActions('Submitted successfully', 'Close');
        this.dialogRef.close('reload');
      }, error => this.utilitiesService.showHttpError(error)));
  }

  setSelection(list: SubHierarchyModel[]) {
    list.forEach(value => {
      value.IsSelect = this.checklistSelection.selected.some(c => c.SNo == value.SNo);

      if (value.lstSubItems?.length) {
        this.setSelection(value.lstSubItems);
      }
    });
  }

  update(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

      }
  }

  formAccessability(formGroup: FormGroup, isEnable: boolean) {
    if (isEnable) {
      formGroup.enable();
      this.isSubmitted = false;
    } else {
      formGroup.disable();
      this.isSubmitted = true;
    }
  }

  dismiss(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}


