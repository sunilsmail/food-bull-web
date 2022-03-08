import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { StoresModel, StoreSpecialDayModel } from 'src/app/shared/app-interfaces';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-add-special-day',
  templateUrl: './add-special-day.component.html',
  styleUrls: ['./add-special-day.component.scss']
})
export class AddSpecialDayComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  specialDay = {} as StoreSpecialDayModel;
  lstTime = [] as Date[];
  storeId: number = 0;

  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<AddSpecialDayComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private storeService: StoreService,
    private alertService: AlertMessageService,
    private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder
  ) {
    this.specialDay = {} as StoreSpecialDayModel;
    this.lstTime = this.utilitiesService.getHours();

    this.fg = this.formBuilder.group({
      FromDateCtrl: new FormControl('', [Validators.required]),
      ToDateCtrl: new FormControl('', [Validators.required]),
      IsAllDayOpenCtrl: new FormControl(),
      OpenHrsCtrl: new FormControl(),
      CloseHrsCtrl: new FormControl(),
      DescriptionCtrl: new FormControl('', [Validators.maxLength(50)]),
    });
  }

  ngOnInit() {
    if (!this.utilitiesService.checkNull(this.parameter)
        && !this.utilitiesService.checkNull(this.parameter.regItem)
        && !this.utilitiesService.checkNull(this.parameter.regItem.storeId)) {
        this.storeId = this.parameter.regItem.storeId;

        if (!this.utilitiesService.checkNull(this.parameter.regItem.item)) {
          this.specialDay = JSON.parse(JSON.stringify(this.parameter.regItem.item));
          this.title = "EDIT SPECIAL DAYS";
          this.isEdit = true;

          Object.keys(this.fg.controls).forEach(key => {
            if (key == "FromDateCtrl") {
              this.fg.controls[key].setValue(new Date(this.specialDay.FromDate));
            }
            if (key == "ToDateCtrl") {
              this.fg.controls[key].setValue(new Date(this.specialDay.ToDate));
            }
          });

        } else {
          this.title = 'ADD SPECIAL DAYS';
          this.isEdit = false;
        }
    }

    this.fg.controls['IsAllDayOpenCtrl'].valueChanges.subscribe(value => {
      this.fg.controls['OpenHrsCtrl'].setValidators(value ? [Validators.required] : []);
      this.fg.controls['CloseHrsCtrl'].setValidators(value ? [Validators.required] : []);
      if (!value) {
        this.fg.controls['OpenHrsCtrl'].reset();
        this.fg.controls['OpenHrsCtrl'].setErrors(null);
        this.fg.controls['OpenHrsCtrl'].markAsUntouched();
        this.fg.controls['OpenHrsCtrl'].markAsPristine();

        this.fg.controls['CloseHrsCtrl'].reset();
        this.fg.controls['CloseHrsCtrl'].setErrors(null);
        this.fg.controls['CloseHrsCtrl'].markAsPristine();
        this.fg.controls['CloseHrsCtrl'].markAsUntouched();
      }
      this.fg.clearValidators();
      this.fg.updateValueAndValidity();
    });

  }

  objectComparisonFunction = (option: Date, value: Date): boolean => {
    if (this.utilitiesService.checkNull(value)) {
      return false;
    }
    let optionTime = this.utilitiesService.getTimeSpanFormat(new Date(option).getHours(), new Date(option).getMinutes());
    let valueTime = this.utilitiesService.getTimeSpanFormat(new Date(value).getHours(), new Date(value).getMinutes());

    return optionTime == valueTime;
  }

  submit(formGroup: FormGroup): void {

    if (formGroup.invalid && this.storeId > 0) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

      Object.keys(this.fg.controls).forEach(key => {
        if (key == "FromDateCtrl") {
          this.specialDay.FromDate = this.utilitiesService.getUTCDate(this.fg.controls[key].value);
        }
        if (key == "ToDateCtrl") {
          this.specialDay.ToDate = this.utilitiesService.getUTCDate(this.fg.controls[key].value);
        }
      });

      this.specialDay.OpenHrs = !this.utilitiesService.checkNullAndLength(this.specialDay.OpenHrs) ? this.utilitiesService.getUTCDate(this.specialDay.OpenHrs) : null;
      this.specialDay.CloseHrs = !this.utilitiesService.checkNullAndLength(this.specialDay.CloseHrs) ? this.utilitiesService.getUTCDate(this.specialDay.CloseHrs) : null;
      this.specialDay.IsAllDayOpen =  this.specialDay.IsAllDayOpen ? true : false;

      console.log(JSON.stringify(this.specialDay));

      this.formAccessability(formGroup, false);
      this.subscription.push(this.storeService.addSpecialDaysToStore(this.storeId, JSON.stringify(this.specialDay)).subscribe(
        (result: boolean) => {
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

      Object.keys(this.fg.controls).forEach(key => {
        if (key == "FromDateCtrl") {
          this.specialDay.FromDate = this.utilitiesService.getUTCDate(this.fg.controls[key].value);
        }
        if (key == "ToDateCtrl") {
          this.specialDay.ToDate = this.utilitiesService.getUTCDate(this.fg.controls[key].value);
        }
      });

      this.specialDay.OpenHrs = !this.utilitiesService.checkNullAndLength(this.specialDay.OpenHrs) ? this.utilitiesService.getUTCDate(this.specialDay.OpenHrs) : null;
      this.specialDay.CloseHrs = !this.utilitiesService.checkNullAndLength(this.specialDay.CloseHrs) ? this.utilitiesService.getUTCDate(this.specialDay.CloseHrs) : null;
      this.specialDay.IsAllDayOpen =  this.specialDay.IsAllDayOpen ? true : false;
      console.log(JSON.stringify(this.specialDay));

      this.formAccessability(formGroup, false);
      this.subscription.push(this.storeService.updateSpecialDay(this.specialDay.Id, JSON.stringify(this.specialDay)).subscribe(
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


