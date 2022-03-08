import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { AddOnModel, CategoryModel, ServicesModel, TimingsModel } from 'src/app/shared/app-interfaces';
import { CategoryService } from 'src/app/services/category.service';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { AddOnService } from 'src/app/services/add-on.service';
import { MasterServicesService } from 'src/app/services/master-service.service';

@Component({
  selector: 'foodbull-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  category = {} as CategoryModel;
  menuId: number = 0;
  storeId: number = 0;
  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;
  servicesFBArray = new FormArray([]);
  lstServices = [] as ServicesModel[];

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredAddOnModel: Observable<AddOnModel[]>;
  addOnCtrl = new FormControl();
  lstAddOnModel = [] as AddOnModel[];
  selectedAddOnModels = [] as AddOnModel[];
  savedTimings: TimingsModel[] = [] as TimingsModel[];

  @ViewChild('addOnInput') addOnInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private alertService: AlertMessageService,
    private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private addOnService: AddOnService,
    private masterServicesService: MasterServicesService
  ) {
    this.category = {} as CategoryModel;

    this.bindAddOnModel();

    this.bindServices();

    this.fg = this.formBuilder.group({
      NameCtrl: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
      DescriptionCtrl: new FormControl('', [Validators.maxLength(200)]),
      IsAvailableHrsCtrl: new FormControl(),
      IsHideCategoryCtrl: new FormControl(),
      AddOnModelsCtrl: new FormControl(),
      servicesArray: this.servicesFBArray
    });

    this.filteredAddOnModel = this.fg.controls['AddOnModelsCtrl'].valueChanges.pipe(
      startWith(null),
      map((addOn: AddOnModel | null) => (addOn ? this._filter(addOn) : this.lstAddOnModel.slice())));

  }

  //#region addOn Multiselect

  bindAddOnModel() {
    this.subscription.push(this.addOnService.getAllAddOns().subscribe(data => this.lstAddOnModel = data,
      errors => this.utilitiesService.showHttpError(errors)));
  }

  getOptionText(option: any) {
    return !(typeof option === 'undefined' || option === null || option.length === 0) ? option.Name : '';
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let addOn = <AddOnModel | any>value;

    // Add our fruit
    if ((value || '').trim()) {
      this.selectedAddOnModels.push(addOn);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.addOnCtrl.setValue(null);
  }

  remove(item: AddOnModel, index: number): void {
    this.selectedAddOnModels.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let addOn = <AddOnModel | any>event.option.value;

    this.selectedAddOnModels.push(addOn);
    this.addOnInput.nativeElement.value = '';
    this.addOnCtrl.setValue(null);
  }

  private _filter(query: any): AddOnModel[] {
    let regExpResult: any;
    let p: any = Array.from(query).reduce((a, v, i) => `${a}[^${query.substr(i)}]*?${v}`, '');
    regExpResult = RegExp(p);
    return this.lstAddOnModel.filter(v => v.Sources && v.Sources.toLowerCase().match(regExpResult));
  }
  //#endregion

  ngOnInit() {

    if (!this.utilitiesService.checkNull(this.parameter)
        && !this.utilitiesService.checkNull(this.parameter.regItem)
        && !this.utilitiesService.checkNull(this.parameter.regItem.categoryId)) {

      this.subscription.push(
        this.categoryService.getCategory(this.parameter.regItem.categoryId).subscribe(
              data => this.category = JSON.parse(JSON.stringify(data)),
              error => { this.utilitiesService.showHttpError(error); }));

      this.title = "EDIT CATEGORY";
      this.isEdit = true;

    } else {
      this.title = 'ADD CATEGORY';
      this.isEdit = false;
      this.menuId = !this.utilitiesService.checkNull(this.parameter.regItem.menuId) ? this.parameter.regItem.menuId : 0;
      this.storeId = !this.utilitiesService.checkNull(this.parameter.regItem.storeId) ? this.parameter.regItem.storeId : 0;
      this.category.MenuId = this.menuId;
      this.category.StoreId = this.storeId;
    }
  }

  saveWTCChanges(timings: TimingsModel[]) {
    if (timings) {
      this.savedTimings = timings.filter(c => c.IsAllDayOpen);
    }
  }

  bindServices() {
    this.subscription.push(this.masterServicesService.getAllActiveServices().subscribe(data => {
        this.lstServices = data;
        if (!this.utilitiesService.checkNullAndLength(this.lstServices)) {
          this.lstServices.forEach(service => {
            service.IsSelected = false;
            this.servicesFBArray.controls.push(new FormControl(service.IsSelected));
          });
        }
      }, errors => this.utilitiesService.showHttpError(errors)));
  }

  isServiceSelected(value: any, index: number): boolean {
    if (this.utilitiesService.checkNullAndLength(this.category.ServiceIds)) {
      return false;
    }
    let service =  this.lstServices[index];
    return this.category.ServiceIds.includes(service.Id);
  }

  submit(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

      this.category.AddOnIds = [];
      if (!this.utilitiesService.checkNullAndLength(this.selectedAddOnModels)) {
        let addOns: AddOnModel[] = JSON.parse(JSON.stringify(this.selectedAddOnModels));
        this.category.AddOnIds =  addOns.map((_) => _.Id);
      }

      this.category.ServiceIds = [] as number[];
      if (!(this.utilitiesService.checkNullAndLength(this.lstServices))) {
        (this.fg.get('servicesArray') as FormArray).controls.forEach((item: any, index: number) => {
          this.lstServices[index].IsSelected = item.value;
          if (item.value) {
            this.category.ServiceIds.push(this.lstServices[index].Id);
          }
        });
      }

      this.category.Timings = this.category.IsAvailableHrs ? this.savedTimings : [] as TimingsModel[];

      console.log(JSON.stringify(this.category));

      this.formAccessability(formGroup, false);
      this.subscription.push(
        this.categoryService
            .createCategory(this.category)
            .subscribe((result: boolean) => {
              if (result) {
                this.alertService.SnackBarWithActions('Saved successfully', 'Close');
                this.formAccessability(formGroup, true);
                this.dialogRef.close('reload');
              }
            }, errors => {
              this.formAccessability(formGroup, true);
              this.utilitiesService.showHttpError(errors);
        }));
      }
  }

  update(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {
      this.category.AddOnIds = [];
      if (!this.utilitiesService.checkNullAndLength(this.selectedAddOnModels)) {
        let addOns: AddOnModel[] = JSON.parse(JSON.stringify(this.selectedAddOnModels));
        this.category.AddOnIds =  addOns.map((_) => _.Id);
      }

      this.category.ServiceIds = [] as number[];
      if (!(this.utilitiesService.checkNullAndLength(this.lstServices))) {
        (this.fg.get('servicesArray') as FormArray).controls.forEach((item: any, index: number) => {
          this.lstServices[index].IsSelected = item.value;
          if (item.value) {
            this.category.ServiceIds.push(this.lstServices[index].Id);
          }
        });
      }

      this.category.Timings = this.category.IsAvailableHrs ? this.savedTimings : [] as TimingsModel[];

      console.log(JSON.stringify(this.category));

      this.subscription.push(
        this.categoryService
            .updateCategory(this.category.Id, this.category)
            .subscribe((result: boolean) => {
              if (result) {
                this.alertService.SnackBarWithActions('Updated successfully', 'Close');
                this.formAccessability(formGroup, true);
                this.dialogRef.close('reload');
              }
            }, errors => {
              this.formAccessability(formGroup, true);
              this.utilitiesService.showHttpError(errors);
        }));
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
