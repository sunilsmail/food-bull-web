import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { CityModel, ConfirmDialogModel, ContactModel, CountryModel, ImageFileInfo, LocationModel, StateModel, StoreGroupModel, StoresModel } from 'src/app/shared/app-interfaces';
import { StoreGroupService } from 'src/app/services/store-group.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { StoreService } from 'src/app/services/store.service';
import { ImageService } from 'src/app/services/image.service';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WebConfiguration } from 'src/app/helpers/web-configuration';

@Component({
  selector: 'app-add-store-group',
  templateUrl: './add-store-group.component.html',
  styleUrls: ['./add-store-group.component.scss']
})
export class AddStoreGroupComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  storeGroup = {} as StoreGroupModel;
  lstCountries = [] as CountryModel[];
  lstStates = [] as StateModel[];
  lstCities = [] as CityModel[];
  lstStores = [] as StoresModel[];
  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredStores: Observable<StoresModel[]>;
  storeCtrl = new FormControl();
  selectedStores = [] as StoresModel[];
  cityOptions: Observable<CityModel[]>;

  imageInfo = {} as ImageFileInfo;
  httpImageRequests = {} as Observable<ImageFileInfo>;

  @ViewChild('storeInput') storeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<AddStoreGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private commonService: CommonService,
    private storeService: StoreService,
    private storeGroupService: StoreGroupService,
    private alertService: AlertMessageService,
    private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private imageService: ImageService
  ) {

    this.storeGroup = {} as StoreGroupModel;
    this.storeGroup.ContactModel = {} as ContactModel;
    this.storeGroup.LocationModel = {} as LocationModel;

    this.fg = this.formBuilder.group({
      NameCtrl: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      StoreCtrl: new FormControl(''),
      Address1Ctrl: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      Address2Ctrl: new FormControl('', [Validators.maxLength(256)]),
      CityCtrl: new FormControl(),
      DoorNoCtrl: new FormControl('', [Validators.maxLength(16)]),
      EmailAddressCtrl: new FormControl('', [Validators.email]),
      ZipCodeCtrl: new FormControl('', [Validators.pattern(WebConfiguration.RgxUKPostalCode)]),
      PhoneNumberCtrl: new FormControl('', [Validators.pattern(WebConfiguration.RgxUKPhoneNumber)])
    });

    this.bindStores();

    this.filteredStores = this.fg.controls['StoreCtrl'].valueChanges.pipe(
      startWith(null),
      map((store: StoresModel | null) => store ? this._filter(store) : this.lstStores.slice()));

    this.cityOptions = this.fg.controls['CityCtrl'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCity(value))
      );
  }

  private _filterCity(value: any): any[] {

    const filterValue = this.utilitiesService.checkNullAndLength(value) == true ? '' : typeof value == 'object' ? value.Name.toLowerCase() : value.toLowerCase();

    if (this.utilitiesService.checkNullAndLength(filterValue)) {
      return [];
    }

    this.subscription.push(
      this.commonService
          .searchLocation(value)
          .subscribe(data => {
            this.lstCities = data;
          }));
    return this.lstCities.filter(option => option.Name.toLowerCase().includes(filterValue));
  }

  //#region Stores Multiselect

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let store = <StoresModel | any>value;

    // Add our fruit
    if ((value || '').trim()) {
      this.selectedStores.push(store);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.storeCtrl.setValue(null);
  }

  remove(store: StoresModel, index: number): void {

    this.selectedStores.splice(index, 1);

    // const index = this.selectedStores.indexOf(store);

    // if (index >= 0) {
    //   this.selectedStores.splice(index, 1);
    // }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let store = <StoresModel | any>event.option.value;

    this.selectedStores.push(store);
    this.storeInput.nativeElement.value = '';
    this.storeCtrl.setValue(null);
  }

  private _filter(query: any): StoresModel[] {
      let regExpResult: any;
      let p: any = Array.from(query).reduce((a, v, i) => `${a}[^${query.substr(i)}]*?${v}`, '');
      regExpResult = RegExp(p);
      return this.lstStores.filter(v => v.Name.toLowerCase().match(regExpResult));
  }

  //#endregion


  getOptionText(option: any) {
    return !(typeof option === 'undefined' || option === null || option.length === 0) ? option.Name : '';
  }

  ngOnInit() {

    if (!this.utilitiesService.checkNull(this.parameter)
    && !this.utilitiesService.checkNull(this.parameter.storeGroupId)) {
      this.subscription.push(
        this.storeGroupService
            .getStoreGroup(this.parameter.storeGroupId)
            .subscribe(data => {
              this.storeGroup = data;

              if (this.utilitiesService.checkNull(this.storeGroup.ContactModel)) {
                this.storeGroup.ContactModel = {} as ContactModel;
              }

              if (this.utilitiesService.checkNull(this.storeGroup.Stores)) {
                this.storeGroup.Stores = [] as StoresModel[];
              }

              if (!this.utilitiesService.checkNullAndLength(this.storeGroup.Stores)) {
                this.selectedStores = JSON.parse(JSON.stringify(this.storeGroup.Stores));
              }
            }, errors => {
              this.utilitiesService.showHttpError(errors);
            }));

      this.title = 'EDIT STORE GROUP';
      this.isEdit = true;
    } else {
      this.title = 'ADD NEW STORE GROUP';
      this.isEdit = false;
    }

  }

  get getStoresGroup(): FormGroup {
    return this.formBuilder.group({
      Name: new FormControl()
    }, { updateOn: 'blur' })
  }

  public objectComparisonFunction = function(option: any, value: any): boolean {
    return option.Id === value.Id;
  };

  bindStores() {
    this.subscription.push(
      this.storeService
          .getStores()
          .subscribe(data => {
            this.lstStores = data;

          }, errors => {
            this.utilitiesService.showHttpError(errors);
          }));
  }

  fileSelectionChange(value: any) {
    this.imageInfo = {} as ImageFileInfo;
    this.imageInfo = value ? value[0] : null;
  }

  fileDeleteImage(img: ImageFileInfo) {

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
          this.storeGroupService
              .deleteStoreGroupImage(this.storeGroup.Id, img.Id)
              .subscribe((result: boolean) => {
                this.storeGroup.Logo = {} as ImageFileInfo;
                this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
              }, errors => { this.utilitiesService.showHttpError(errors); }));
      }
    });
  }

  submit(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    }  else {
      if (!(this.utilitiesService.checkNull(this.imageInfo) || this.utilitiesService.checkNull(this.imageInfo.base64))) {

        this.httpImageRequests = this.imageService.uploadImage(this.imageInfo);

        const joint = forkJoin([this.httpImageRequests]).subscribe(([res]) => {
          this.storeGroup.Logo = res;
          this.submitCall(this.storeGroup, formGroup);
        });
      } else {
        this.submitCall(this.storeGroup, formGroup);
      }
    }
  }

  submitCall(storeGroup: StoreGroupModel, formGroup: FormGroup): void {

    this.formAccessability(formGroup, false);
    storeGroup.Stores = [] as StoresModel[];
    if (!this.utilitiesService.checkNullAndLength(this.selectedStores)) {
      storeGroup.Stores = JSON.parse(JSON.stringify(this.selectedStores));
    }

    storeGroup.ContactModel.IsMain = !this.utilitiesService.checkNull(this.storeGroup.ContactModel.MobileNumber) || !this.utilitiesService.checkNull(this.storeGroup.ContactModel.Email);
    console.log(JSON.stringify(storeGroup));

    this.subscription.push(
      this.storeGroupService
          .createStoreGroup(storeGroup)
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


  update(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else if (!this.utilitiesService.checkNull(this.imageInfo) && !this.utilitiesService.checkNull(this.imageInfo.base64)) {
      this.httpImageRequests = this.imageService.uploadImage(this.imageInfo);
      const joint = forkJoin([this.httpImageRequests]).subscribe(([res]) => {
        this.storeGroup.Logo = res;
        this.updateStore(formGroup);
      })
    } else {
            this.updateStore(formGroup);
        }
  }

  updateStore(formGroup: FormGroup) {
    this.formAccessability(formGroup, false);
    this.storeGroup.Stores = [] as StoresModel[];
    if (!this.utilitiesService.checkNullAndLength(this.selectedStores)) {
      this.storeGroup.Stores = JSON.parse(JSON.stringify(this.selectedStores));
    }
    this.storeGroup.ContactModel.IsMain = !this.utilitiesService.checkNull(this.storeGroup.ContactModel.MobileNumber) || !this.utilitiesService.checkNull(this.storeGroup.ContactModel.Email);
    console.log(JSON.stringify(this.storeGroup));

    this.subscription.push(
      this.storeGroupService
          .updateStoreGroup(this.storeGroup.Id, JSON.stringify(this.storeGroup))
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

