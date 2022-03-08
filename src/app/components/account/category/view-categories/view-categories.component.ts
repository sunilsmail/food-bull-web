import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { StoreService } from 'src/app/services/store.service';
import { CategoryModel, ConfirmDialogModel, ItemModel, MenuModel, StoresModel } from 'src/app/shared/app-interfaces';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { MenuService } from 'src/app/services/menu.service';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { AddItemComponent } from 'src/app/components/account/item/add-item/add-item.component';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';
import { ViewItemComponent } from '../../item/view-item/view-item.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { AddAddonsComponent } from '../add-addons/add-addons.component';

@Component({
  selector: 'foodbull-view-categories',
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.scss']
})
export class ViewCategoriesComponent implements OnInit, AfterViewInit {
  private subscription: Subscription[] = [];
  menuId: number = 0;
  storeId: number = 0;
  currentTabIndex: number = 0;
  private sub: any;
  menu = {} as MenuModel;
  store = {} as StoresModel;
  lstCategories = [] as CategoryModel[];

  displayedColumns: string[] = ['ItemName', 'Price', 'Availability', 'Actions'];
  dataSource = new MatTableDataSource<ItemModel>();
  @ViewChild(MatPaginator, {static: true}) paginator = {} as MatPaginator;
  @ViewChild(MatSort, {static: true}) sort = {} as MatSort;

  @ViewChild('table', { static: false }) table: MatTable<ItemModel> = {} as MatTable<ItemModel>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    private storeService: StoreService,
    private menuService: MenuService,
    public dialog: MatDialog,
    private alertService: AlertMessageService,
    private categoryService: CategoryService,
    private itemService: ItemService
  ) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.menuId = params.menuId;
      this.storeId = params.storeId;

      this.bindMenuDetails();
      this.bindStoreDetails();
      this.bindCategoryGrid();
    });
  }

  ngAfterViewInit() {
  }

  dropTable(event: CdkDragDrop<MatTableDataSource<ItemModel>>) {
    const prevIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource.data, prevIndex, event.currentIndex);
    let selectedOrder = event.currentIndex + 1;


    console.log('Selected Order: ');
    console.log(selectedOrder);
    console.log('Selected Item: ');
    console.log(JSON.stringify(event.item.data));

    this.subscription.push(
      this.itemService.updateOrder(selectedOrder, event.item.data).subscribe(
            data => {
              let result = JSON.parse(JSON.stringify(data));
              if (result) {
                this.table.renderRows();
                let categId = this.getCategoryIdByIndex(this.currentTabIndex);
                this.getItemsDataSource(categId);
              }
            },
            error => { this.utilitiesService.showHttpError(error); }));
  }

  bindMenuDetails(): void {
    if (this.utilitiesService.checkNull(this.menuId) || this.menuId <= 0) {
      return;
    }

    this.subscription.push(
      this.menuService.getMenu(this.menuId).subscribe(
            data => { this.menu = JSON.parse(JSON.stringify(data)); },
            error => { this.utilitiesService.showHttpError(error); }));
  }

  bindStoreDetails(): void {
    if (this.utilitiesService.checkNull(this.storeId) || this.storeId <= 0) {
      return;
    }

    this.subscription.push(
      this.storeService.getBasicStore(this.storeId).subscribe(
            data => { this.store = JSON.parse(JSON.stringify(data)); },
            error => { this.utilitiesService.showHttpError(error); }));
  }

  selectedTabChange(ev: any) {
    if (ev.index >= 0) {
      this.currentTabIndex = ev.index;
      let categId = this.getCategoryIdByIndex(ev.index);
      this.getItemsDataSource(categId);
    }
  }

  getCategoryIdByIndex(index: number): number {
    return this.lstCategories[index].Id;
  }

  //#region Category
  bindCategoryGrid(): void {
    if (this.utilitiesService.checkNull(this.storeId) || this.storeId <= 0
      || this.utilitiesService.checkNull(this.menuId) || this.menuId <= 0) {
      return;
    }

    this.subscription.push(
      this.categoryService.getCategories(this.storeId, this.menuId).subscribe(
            data => {
              this.lstCategories = JSON.parse(JSON.stringify(data));
              if (!this.utilitiesService.checkNullAndLength(this.lstCategories)) {
                this.currentTabIndex = 0;
                let obj = { index : 0 };
                this.selectedTabChange(obj);
              }
            },
            error => { this.utilitiesService.showHttpError(error); }));
  }

  addCategory(): void {
    let obj = {
      menuId: this.menu.Id,
      storeId: this.store.Id,
      categoryId: null
    }

    const dialogRef = this.dialog.open(AddCategoryComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindCategoryGrid();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  editCategory(categoryId: number): void {
    let obj = {
      menuId: this.menu.Id,
      storeId: this.store.Id,
      categoryId: categoryId
    }

    const dialogRef = this.dialog.open(AddCategoryComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindCategoryGrid();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }
  //#endregion Category End

  //#region Item
  getItemsDataSource(categoryId: number) {
    this.subscription.push(
      this.itemService.getItems(categoryId).subscribe(
            data => {
              this.dataSource = new MatTableDataSource<ItemModel>(data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }));
  }

  addItem(categoryId: number): void {
    if (this.utilitiesService.checkNull(categoryId) || categoryId <= 0) {
      return;
    }

    let obj = {
      categoryId: categoryId,
      item: null
    }

    const dialogRef = this.dialog.open(AddItemComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        let categId = this.getCategoryIdByIndex(this.currentTabIndex);
        this.getItemsDataSource(categId);
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  viewItem(id: number): void {
    if (this.utilitiesService.checkNull(id) || id <= 0) {
      return;
    }

    const dialogRef = this.dialog.open(ViewItemComponent, {
      data: { itemId: id },
      panelClass: 'dialog-40'
    });
  }

  deleteItem(item: ItemModel): void {

    const dialogData = new ConfirmDialogModel('DELETE ' + item.Name, 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(
          this.itemService
              .deleteItem(item.Id)
              .subscribe((result: boolean) => {
                this.alertService.SnackBarWithActions('Deleted successfully', 'Close');

                let categId = this.getCategoryIdByIndex(this.currentTabIndex);
                this.getItemsDataSource(categId);

              }, errors => { this.utilitiesService.showHttpError(errors); }));
      }
    });

  }

  editItem(item: ItemModel): void {
    if (this.utilitiesService.checkNull(item)) {
      return;
    }

    let obj = {
      categoryId: item.CategoryId,
      itemId: item.Id
    }

    const dialogRef = this.dialog.open(AddItemComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        let categId = this.getCategoryIdByIndex(this.currentTabIndex);
        this.getItemsDataSource(categId);
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  itemAvailabilityToggle(ev: MatSlideToggleChange, item: ItemModel) {

    let msg = ev.checked ? 'Available' : 'Not Available';

    const dialogData = new ConfirmDialogModel('CONFIRM', 'Are you sure you want to change the status to ' + msg, '');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(
          this.itemService
              .updateStatus(item.Id)
              .subscribe((result: boolean) => {
                this.alertService.SnackBarWithActions('Updated successfully', 'Close');

                let categId = this.getCategoryIdByIndex(this.currentTabIndex);
                this.getItemsDataSource(categId);

              }, errors => { this.utilitiesService.showHttpError(errors); }));
      } else {
        ev.source.checked = !ev.checked;
      }
    });
  }

  //#endregion item

  addNewAddons() {

    let obj = {
      storeId: this.store.Id,
      categoryId: null,
      itemId: null
    }

    const dialogRef = this.dialog.open(AddAddonsComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.storeId = this.store.Id;
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }
}
