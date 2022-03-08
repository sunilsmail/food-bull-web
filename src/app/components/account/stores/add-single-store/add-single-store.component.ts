import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { CityModel, ConfirmDialogModel, ContactModel, ImageFileInfo, LocationModel, StoresModel } from 'src/app/shared/app-interfaces';
import { CommonService } from 'src/app/services/common.service';
import { StoreService } from 'src/app/services/store.service';
import { WebConfiguration } from 'src/app/helpers/web-configuration';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ImageService } from 'src/app/services/image.service';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'foodbull-add-single-store',
  templateUrl: './add-single-store.component.html',
  styleUrls: ['./add-single-store.component.scss']
})
export class AddSingleStoreComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  store = {} as StoresModel;
  lstCities = [] as CityModel[];
  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;
  filteredOptions: Observable<CityModel[]>;
  imageInfo = {} as ImageFileInfo;
  httpImageRequests = {} as Observable<ImageFileInfo>;

  constructor(
    public dialogRef: MatDialogRef<AddSingleStoreComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private commonService: CommonService,
    private storeService: StoreService,
    private alertService: AlertMessageService,
    private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private imageService: ImageService
  ) {
    this.filteredOptions = new Observable<CityModel[]>();
  }

  getOptionText(option: CityModel) {
    return !(typeof option === 'undefined' || option === null) ? option.Name : '';
  }

  private _filter(value: any): any[] {

    const filterValue = this.utilitiesService.checkNullAndLength(value) == true ? '' : typeof value == 'object' ? value.Name.toLowerCase() : value.toLowerCase();

    if (this.utilitiesService.checkNullAndLength(filterValue)) {
      return [];
    }

    this.subscription.push(this.commonService.searchLocation(value).subscribe(data => this.lstCities = data));
    return this.lstCities.filter(option => option.Name.toLowerCase().includes(filterValue));
  }

  ngOnInit() {

    this.store = {} as StoresModel;
    this.store.ContactModel = {} as ContactModel;
    this.store.LocationModel = {} as LocationModel;

    this.fg = this.formBuilder.group({
      NameCtrl: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      DoorNoCtrl: new FormControl('', [Validators.maxLength(50)]),
      Address1Ctrl: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      Address2Ctrl: new FormControl('', [Validators.maxLength(200)]),
      CityCtrl: new FormControl('', [Validators.required]),
      ZipCodeCtrl: new FormControl('', [Validators.pattern(WebConfiguration.RgxUKPostalCode)]),
      PhoneNumberCtrl: new FormControl('', [Validators.pattern(WebConfiguration.RgxUKPhoneNumber)]),
      EmailAddressCtrl: new FormControl('', [Validators.email])
    });

    this.filteredOptions = this.fg.controls['CityCtrl'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)));

    if (!this.utilitiesService.checkNull(this.parameter)
    && !this.utilitiesService.checkNull(this.parameter.storeId)) {

      this.subscription.push(
        this.storeService
            .getBasicStore(this.parameter.storeId)
            .subscribe(data => {
              this.store = data;
              if (this.utilitiesService.checkNull(this.store.ContactModel)) {
                this.store.ContactModel = {} as ContactModel;
              }
            }, errors => {
              this.utilitiesService.showHttpError(errors);
            }));
      this.title = 'EDIT STORE';
      this.isEdit = true;
    } else {
      this.title = 'ADD NEW STORE';
      this.isEdit = false;
    }
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
            this.storeService
                .deleteStoreImage(this.store.Id, img.Id)
                .subscribe((result: boolean) => {
                  this.store.Logo = {} as ImageFileInfo;
                  this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
                }, errors => {
                  this.utilitiesService.showHttpError(errors);
                }));
        }
      });
  }

  submit(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

        if (!this.utilitiesService.checkNullAndLength(this.store.ContactModel.MobileNumber) || !this.utilitiesService.checkNullAndLength(this.store.ContactModel.Email)) {
          this.store.ContactModel.IsMain = true;
        } else {
          this.store.ContactModel = {} as ContactModel;
        }

        if (!(this.utilitiesService.checkNull(this.imageInfo) || this.utilitiesService.checkNull(this.imageInfo.base64))) {

          this.httpImageRequests = this.imageService.uploadImage(this.imageInfo);

          const joint = forkJoin([this.httpImageRequests]).subscribe(([res]) => {
            this.store.Logo = res;
            this.submitCall(this.store, formGroup);
          });
        } else {
          this.submitCall(this.store, formGroup);
        }
      }
  }

  submitCall(store: StoresModel, formGroup: FormGroup): void {

    console.log(JSON.stringify(store));

    this.formAccessability(formGroup, false);
    this.subscription.push(
      this.storeService
          .createStore(store)
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
          this.store.Logo = res;
          this.updateStore(formGroup);
        })
      } else {
        this.updateStore(formGroup);
      }
  }

  updateStore(formGroup: FormGroup): void {
    this.formAccessability(formGroup, false);

    if (!this.utilitiesService.checkNullAndLength(this.store.ContactModel.MobileNumber) || !this.utilitiesService.checkNullAndLength(this.store.ContactModel.Email)) {
      this.store.ContactModel.IsMain = true;
    } else {
      this.store.ContactModel = {} as ContactModel;
    }

    console.log(JSON.stringify(this.store));

    this.subscription.push(this.storeService.updateStore(this.store.Id, JSON.stringify(this.store)).subscribe(
      (result: boolean) => {
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

  fileSelectionChange(value: any) {
    this.imageInfo = {} as ImageFileInfo;
    this.imageInfo = value ? value[0] : null;
  }

  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}

