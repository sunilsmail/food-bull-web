import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { WebConfiguration } from 'src/app/helpers/web-configuration';
import { AddOnModel, AllergenTagsModel, ConfirmDialogModel, ImageFileInfo, ItemModel, ItemTypeModel, UOMModel } from 'src/app/shared/app-interfaces';
import { ItemService } from 'src/app/services/item.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ImageService } from 'src/app/services/image.service';
import { from } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { CommonService } from 'src/app/services/common.service';
import { AddOnService } from 'src/app/services/add-on.service';
import { AllergenTagsService } from 'src/app/services/allergen-tags.service';

@Component({
  selector: 'foodbull-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  UOMModelsGroup = {} as FormArray;
  item = {} as ItemModel;
  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;
  lstImages = [] as ImageFileInfo[];
  httpImageRequests = [] as Observable<ImageFileInfo>[];
  radioValue: any = '';

  allergensFBArray = new FormArray([]);
  lstAllergensServices = [] as AllergenTagsModel[];

  lstItemTypes = [] as ItemTypeModel[];

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredAddOnModel: Observable<AddOnModel[]>;
  addOnCtrl = new FormControl();
  lstAddOnModel = [] as AddOnModel[];
  selectedAddOnModels = [] as AddOnModel[];
  @ViewChild('addOnInput') addOnInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<AddItemComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private alertService: AlertMessageService,
    private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private imageService: ImageService,
    private commonService: CommonService,
    private addOnService: AddOnService,
    public dialog: MatDialog,
    private allergenTagsService: AllergenTagsService
  ) {
    this.item = {} as any;
    this.item.IsSingle = true;
    this.item.UOMModels = [] as UOMModel[];
    this.UOMModelsGroup = {} as FormArray;

    this.fg = this.formBuilder.group({
      ItemTypeCtrl: new FormControl('', [Validators.required]),
      NameCtrl: new FormControl('', [Validators.required]),
      SubTitleCtrl: new FormControl('', [Validators.maxLength(100)]),
      DescriptionCtrl: new FormControl('', [Validators.maxLength(50)]),
      PriceCtrl: new FormControl(''),
      PriceTypeCtrl: new FormControl(''),
      UOMModelsGroup: this.formBuilder.array([], {updateOn: 'blur'}),
      AddOnModelsCtrl: new FormControl(),
      allergensArray: this.allergensFBArray,
      DisplayNameCtrl: new FormControl(),
      PrintNameCtrl: new FormControl(),
    });

    this.bindAddOnModel();

    this.bindAllergens();

    this.filteredAddOnModel = this.fg.controls['AddOnModelsCtrl']
      .valueChanges
      .pipe(
        startWith(null),
        map((addOn: AddOnModel | null) => (addOn ? this._filter(addOn) : this.lstAddOnModel.slice())));
  }

  //#region Stores Multiselect

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

    this.lstItemTypes = this.commonService.getItemTypes();

    if (!this.utilitiesService.checkNull(this.parameter)
        && !this.utilitiesService.checkNull(this.parameter.regItem)
        && !this.utilitiesService.checkNull(this.parameter.regItem.itemId)) {

      this.subscription.push(
        this.itemService.getItem(this.parameter.regItem.itemId)
            .subscribe((result: ItemModel) => {
              this.item = JSON.parse(JSON.stringify(result));

              if (!this.item.IsSingle) {
                // check is multiple.
                // add form group based on UOMModel length.

                this.fg.controls['UOMModelsGroup'] = this.formBuilder.array([]);
                if(!this.utilitiesService.checkNullAndLength(this.item.UOMModels)) {
                  for (let index = 0; index < this.item.UOMModels.length; index++) {
                    let control = <FormArray>this.fg.controls['UOMModelsGroup'];
                    control.push(this.getUOMModelsGroup);
                  }
                }

                (this.fg.get('UOMModelsGroup') as FormArray).controls.forEach((formGroupItem: any, index: number) => {
                  Object.keys(formGroupItem.controls).forEach((key, cindex) => {

                    switch(key) {
                      case "Id": formGroupItem.controls[key].setValue(this.item.UOMModels[index].Id); break;
                      case "IsActive": formGroupItem.controls[key].setValue(this.item.UOMModels[index].IsActive); break;
                      case "IsDefault": formGroupItem.controls[key].setValue(this.item.UOMModels[index].IsDefault); break;
                      case "Name": formGroupItem.controls[key].setValue(this.item.UOMModels[index].Name); break;
                      case "Price": formGroupItem.controls[key].setValue(this.item.UOMModels[index].Price); break;
                      default: break;
                    }
                  });
                });
              }

            }, errors => { this.utilitiesService.showHttpError(errors); }));

      this.title = "EDIT ITEM";
      this.isEdit = true;
    } else {
      this.item.CategoryId = JSON.parse(JSON.stringify(this.parameter.regItem.categoryId));
      this.title = 'ADD ITEM';
      this.isEdit = false;
    }

    this.fg.controls['PriceTypeCtrl'].valueChanges.subscribe(isSingle => {
      if (isSingle) {
          // single price selection
          this.fg.get('PriceCtrl')?.setValidators([Validators.required, Validators.pattern(WebConfiguration.RgxDecimalRound2)]);
          this.fg.get('PriceCtrl')?.updateValueAndValidity();
          this.fg.get('UOMModelsGroup')?.clearValidators();
      } else if (!isSingle) {
        // multiple price selection
        this.item.Price = 0;
        this.fg.get('UOMModelsGroup')?.setErrors(null);
        this.fg.get('PriceCtrl')?.setErrors(null);
        this.fg.get('PriceCtrl')?.clearValidators();
        this.fg.get('PriceCtrl')?.updateValueAndValidity();
      }
    });
  }

  bindAddOnModel(): void {
    this.subscription.push(this.addOnService.getAllAddOns().subscribe(data => this.lstAddOnModel = data,
      errors => this.utilitiesService.showHttpError(errors)));
  }

  bindAllergens(): void {
    this.subscription.push(this.allergenTagsService.getAllActiveAlergensTags().subscribe(data => {
      this.lstAllergensServices = data;

      if (!this.utilitiesService.checkNullAndLength(this.lstAllergensServices)) {
        this.lstAllergensServices.forEach(allergen => {
          allergen.IsSelected = false;
          this.allergensFBArray.controls.push(new FormControl(allergen.IsSelected));
        });
      }
    }, errors => this.utilitiesService.showHttpError(errors)));
  }

  get getUOMModelsGroup(): FormGroup {
    return this.formBuilder.group({
      Id: new FormControl(''),
      Name: new FormControl('', Validators.required),
      Price: new FormControl('', [Validators.required, Validators.pattern(WebConfiguration.RgxDecimalRound2)]),
      IsDefault: new FormControl(false),
      IsActive: new FormControl('')
    });
  }

  get getUOMModelsArray() {
    return this.fg.get('UOMModelsGroup') as FormArray;
  }

  addNewUOM() {
    let control = <FormArray>this.fg.controls['UOMModelsGroup'];
    control.push(this.getUOMModelsGroup);
  }

  deleteUOM(index: number) {
    let control = <FormArray>this.fg.controls['UOMModelsGroup'];
    control.removeAt(index);
  }

  getRadioChangeEvent(items: any, uomIndex: number): void {
    if (this.utilitiesService.checkNullAndLength(items)) {
      return;
    }
    items.forEach((item: any, index: number) => {
      Object.keys(item.controls).forEach((key, cindex) => {
        if (key == "IsDefault") {
          let status = uomIndex == index ? true : false;
          item.controls[key].setValue(status);
        }
      });
    });
  }

  getRadioValue(item: any): boolean {
    return item.controls['IsDefault'].value;
  }

  priceTypeChange(selection: boolean) {

    if (selection) {
      // single price selection
      this.fg.controls['UOMModelsGroup'] = this.formBuilder.array([]);
    } else {
      // multiple price selection
      // (this.fg.get('UOMModelsGroup') as FormArray).push(this.getUOMModelsGroup);
    }
  }

  isAllergensSelected(value: any, index: number): boolean {
    if (this.utilitiesService.checkNullAndLength(this.item.AllergienTagIds)) {
      return false;
    }
    let service =  this.lstAllergensServices[index];
    return this.item.AllergienTagIds.includes(service.Id);
  }

  fileSelectionChange(value: any) {
    this.lstImages = !this.utilitiesService.checkNullAndLength(value) ? value.map((x: any) => Object.assign({}, x)) : [] as ImageFileInfo[];
  }

  fileDeleteImage(img: ImageFileInfo): void {

    if (this.utilitiesService.checkNull(img.Id)) {
      this.alertService.SnackBarWithActions('Image has no ID', 'Close');
      return;
    }
    const dialogData = new ConfirmDialogModel(`DELETE IMAGE`, 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(
          this.itemService.deleteItemImage(this.item.Id, img.Id)
                .subscribe((result: boolean) => {

                  let index = this.item.Images.map(i => i.IMGID).indexOf(img.IMGID);
                  if (index != -1) {
                    setTimeout(() => {
                      this.item.Images.splice(index, 1);

                      const tempStorage = JSON.parse(JSON.stringify(this.item.Images));

                      this.item.Images = [] as ImageFileInfo[];
                      this.item.Images = JSON.parse(JSON.stringify(tempStorage));
                    }, 100);
                  }

                  this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
                }, errors => this.utilitiesService.showHttpError(errors)));
      }
    });
  }

  submit(formGroup: FormGroup): void {

    if (!this.item.IsSingle) {
      let res = this.fg.get('UOMModelsGroup')?.value.find((_: UOMModel) => _.IsDefault == true);
      if (this.utilitiesService.checkNull(res)) {
        this.alertService.SnackBarWithActions('Select default price', 'Close');
        return;
      }

      this.item.UOMModels = [] as UOMModel[];
      this.fg.get('UOMModelsGroup')?.value.forEach((item: any) => {
        let uom = {} as UOMModel;
        uom.Id = 0;
        uom.IsActive = true;
        uom.IsDefault = item.IsDefault ? true : false;
        uom.Name = item.Name;
        uom.Price = +item.Price;

        this.item.UOMModels.push(uom);
      });
    } else {
      this.item.UOMModels = [] as UOMModel[];
    }

    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

      this.item.AllergienTagIds = [] as number[];
      if (!(this.utilitiesService.checkNullAndLength(this.lstAllergensServices))) {
        (this.fg.get('allergensArray') as FormArray).controls.forEach((item: any, index: number) => {
          this.lstAllergensServices[index].IsSelected = item.value;
          if (item.value) {
            this.item.AllergienTagIds.push(this.lstAllergensServices[index].Id);
          }
        });
      }

      this.item.Images = [] as ImageFileInfo[];

      const observable = from(this.lstImages);
      const subscription = observable.subscribe(subscriber => {
        this.httpImageRequests.push(this.imageService.uploadImage(subscriber));
      })

      forkJoin(this.httpImageRequests).subscribe((res) => {
        res.forEach((imageItem: any) => {
          this.item.Images.push(imageItem);
        });

        this.item.Price = +this.item.Price; // + converts string to number. as ngModel is converting input to string.
        this.item.IsActive = true;
        this.item.IsDefault = true;

        console.log(JSON.stringify(this.item));

        this.formAccessability(formGroup, false);
        this.subscription.push(
          this.itemService
              .createItem(this.item)
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
      });
      }
  }

  update(formGroup: FormGroup): void {

    if (!this.item.IsSingle) {
      let res = this.fg.get('UOMModelsGroup')?.value.find((_: UOMModel) => _.IsDefault == true);
      if (this.utilitiesService.checkNull(res)) {
        this.alertService.SnackBarWithActions('Select default price', 'Close');
        return;
      }

      this.item.UOMModels = [] as UOMModel[];
      this.fg.get('UOMModelsGroup')?.value.forEach((item: any) => {
        let uom = {} as UOMModel;
        uom.Id = !this.utilitiesService.checkNullAndLength(item.Id) ? item.Id : 0;
        uom.IsActive = true;
        uom.IsDefault = item.IsDefault ? true : false;
        uom.Name = item.Name;
        uom.Price = +item.Price;

        this.item.UOMModels.push(uom);
      });
    } else {
      this.item.UOMModels = [] as UOMModel[];
    }


    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else if (this.utilitiesService.checkNull(this.item.Images)) {
      this.alertService.SnackBarWithActions('Select images', 'Close');
      } else {
        if (!this.utilitiesService.checkNull(this.item.Images)) {
            if (!this.utilitiesService.checkNullAndLength(this.lstImages)) {
              let lstNewImages: ImageFileInfo[] = [];
              lstNewImages = this.lstImages.filter((_) => _.IMGID == (null || '' || undefined));
              if (lstNewImages.length > 0) {
                this.uploadNewImagesAndSave(formGroup, lstNewImages);
              } else {
                this.updateItem(formGroup);
              }
            }
        } else {
          this.uploadNewImagesAndSave(formGroup, this.lstImages);
        }
    }
  }

  uploadNewImagesAndSave(formGroup: FormGroup, images: ImageFileInfo[]) {

    // this.item.Images = [] as ImageFileInfo[];

    const observable = from(images);
    const subscription = observable.subscribe(subscriber => {
      this.httpImageRequests.push(this.imageService.uploadImage(subscriber));
    })

    forkJoin(this.httpImageRequests).subscribe((res) => {
      res.forEach((imageItem: any) => {
        this.item.Images.push(imageItem);
      });
      this.updateItem(formGroup);
    });
  }

  updateItem(formGroup: FormGroup): void {
    this.item.Price = +this.item.Price; // + converts string to number. as ngModel is converting input to string.

    console.log(JSON.stringify(this.item));
    this.formAccessability(formGroup, false);
    this.subscription.push(
      this.itemService
          .updateItem(this.item.Id, this.item)
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
