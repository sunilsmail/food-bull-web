import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { StoresModel, StoreTimingsModel } from 'src/app/shared/app-interfaces';
import { CommonService } from 'src/app/services/common.service';
import { StoreService } from 'src/app/services/store.service';
import { DayOfWeek } from 'src/app/enums/day-of-week';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-add-store-timings',
  templateUrl: './add-store-timings.component.html',
  styleUrls: ['./add-store-timings.component.scss']
})
export class AddStoreTimingsComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  storeTimings = [] as StoreTimingsModel[];
  lstTime = [] as Date[];
  store = {} as StoresModel;
  weekDays = DayOfWeek;
  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<AddStoreTimingsComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private commonService: CommonService,
    private storeService: StoreService,
    private alertService: AlertMessageService,
    private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder
  ) {
    this.storeTimings = [] as StoreTimingsModel[];
    this.lstTime = this.utilitiesService.getHours();

    this.fg = this.formBuilder.group({
      timingsGroup: this.formBuilder.array([this.getTimingsGroup])
    }, { updateOn: 'blur' });

    this.addTimingItems();

    if (!this.utilitiesService.checkNull(this.parameter)
        && !this.utilitiesService.checkNull(this.parameter.regItem)
        && !this.utilitiesService.checkNull(this.parameter.regItem.store)) {
      this.store = JSON.parse(JSON.stringify(this.parameter.regItem.store));
      if (!this.utilitiesService.checkNull(this.parameter.regItem.items)) {

        let timings = JSON.parse(JSON.stringify(this.parameter.regItem.items));
        this.title = "EDIT STORE TIMINGS";
        this.isEdit = true;

        (this.fg.get('timingsGroup') as FormArray).controls.forEach((item: any, index: number) => {
          Object.keys(item.controls).forEach((key, cindex) => {

            switch(key) {
              case "CloseHrs": item.controls[key].setValue(timings[index].CloseHrs); break;
              case "DayOfWeek": item.controls[key].setValue(timings[index].DayOfWeek); break;
              case "IsAllDayOpen": item.controls[key].setValue(timings[index].IsAllDayOpen); break;
              case "IsNextDay": item.controls[key].setValue(timings[index].IsNextDay); break;
              case "OpenHrs": item.controls[key].setValue(timings[index].OpenHrs); break;
              case "StoreId": item.controls[key].setValue(timings[index].StoreId); break;
              case "Id": item.controls[key].setValue(timings[index].Id); break;
              default: break;
            }
          });
        });
      } else {
        this.title = 'STORE TIMINGS';
        this.isEdit = false;
      }
    }

    this.fg.get('timingsGroup')?.valueChanges.subscribe(value => {
      value.forEach((element: any) => {
        if (element.IsAllDayOpen) {
          if ( typeof(element.OpenHrs) == 'object' && typeof(element.CloseHrs) == 'object') {
            if (element.OpenHrs > element.CloseHrs) {
              element.IsNextDay = true;
            }
          }
          // value.OpenHrsCtrl.setValidators([Validators.required]);
          // element.CloseHrsCtrl.setValidators([Validators.required]);
          // element.updateValueAndValidity();
        } else {
          // element.OpenHrsCtrl.setValidators(null);
          // element.CloseHrsCtrl.setValidators(null);
          // element.updateValueAndValidity();
        }
      });
    });

  }

  get getTimingsGroup(): FormGroup {
    return this.formBuilder.group({
      Id: new FormControl(),
      DayOfWeek: new FormControl(),
      OpenHrs: new FormControl(),
      CloseHrs: new FormControl(),
      IsAllDayOpen: new FormControl(),
      IsNextDay: new FormControl()
    }, { updateOn: 'blur' });
  }

  get getTimingArray() {
    return this.fg.get('timingsGroup') as FormArray;
  }

  addTimingItems() {
    let weekDayLength = [1,2,3,4,5,6];
    for (let index = 0; index < weekDayLength.length; index++) {
      (this.fg.get('timingsGroup') as FormArray).push(this.getTimingsGroup);
    }
  }

  getDurationAccess(item: MatSlideToggle): boolean {
    return item.checked == false ? false : true;
  }

  isNextDay(item: any): boolean {
    if (this.utilitiesService.checkNull(item.value.OpenHrs) && this.utilitiesService.checkNull(item.value.CloseHrs)) {
      return false;
    }

    let startTime = this.utilitiesService.getTimeSpanFormat(new Date(item.value.OpenHrs).getHours(), new Date(item.value.OpenHrs).getMinutes());
    let endTime = this.utilitiesService.getTimeSpanFormat(new Date(item.value.CloseHrs).getHours(), new Date(item.value.CloseHrs).getMinutes());
    return item.value.IsNextDay = startTime > endTime;
  }

  objectComparisonFunction = (option: Date, value: Date): boolean => {
    if (this.utilitiesService.checkNull(value)) {
      return false;
    }
    let optionTime = this.utilitiesService.getTimeSpanFormat(new Date(option).getHours(), new Date(option).getMinutes());
    let valueTime = this.utilitiesService.getTimeSpanFormat(new Date(value).getHours(), new Date(value).getMinutes());

    return optionTime == valueTime;
  };

  ngOnInit() {}

  submit(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

      this.storeTimings = [] as StoreTimingsModel[];
      let weekDayIndex = 0;
      this.fg.get('timingsGroup')?.value.forEach((item: any) => {
        let storeTiming = {} as StoreTimingsModel;
        storeTiming.CloseHrs = this.utilitiesService.getUTCDate(item.CloseHrs);
        storeTiming.DayOfWeek = this.isEdit ? item.DayOfWeek : weekDayIndex;
        storeTiming.IsAllDayOpen = item.IsAllDayOpen ? true : false;
        storeTiming.IsNextDay = item.IsNextDay ? true : false;
        storeTiming.OpenHrs = this.utilitiesService.getUTCDate(item.OpenHrs);
        storeTiming.StoreId = this.store.Id;
        storeTiming.Id = this.isEdit ? item.Id : 0;

        this.storeTimings.push(storeTiming);
        weekDayIndex++;
      });

      this.formAccessability(formGroup, false);
      console.log(JSON.stringify(this.storeTimings));

      this.subscription.push(
        this.storeService
            .addTimingsToStore(this.store.Id, JSON.stringify(this.storeTimings))
            .subscribe((result: boolean) => {
              if (result) {
                let msg = this.isEdit ? 'Updated successfully' : 'Saved successfully';
                this.alertService.SnackBarWithActions(msg, 'Close');
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


