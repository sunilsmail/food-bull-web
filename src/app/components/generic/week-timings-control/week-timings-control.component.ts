import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { StoresModel, TimingsModel } from 'src/app/shared/app-interfaces';
import { CommonService } from 'src/app/services/common.service';
import { DayOfWeek } from 'src/app/enums/day-of-week';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'foodbull-week-timings-control',
  templateUrl: './week-timings-control.component.html',
  styleUrls: ['./week-timings-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekTimingsControlComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() weekTimings?: TimingsModel[] = [] as TimingsModel[];
  @Input() isEdit: boolean = false;
  @Input() tag: string = '';
  @Input() RefId?: number;

  @Output() saveChanges: EventEmitter<TimingsModel[]> = new EventEmitter<TimingsModel[]>();

  fg = {} as FormGroup;
  storeTimings = [] as TimingsModel[];
  lstTime = [] as Date[];
  store = {} as StoresModel;
  weekDays = DayOfWeek;

  constructor(
    private commonService: CommonService,
    private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder
  ) {

    this.fg = this.formBuilder.group({
      timingsGroup: this.formBuilder.array([this.getTimingsGroup])
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
    });
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

  ngOnInit() {
    this.addTimingItems();
    this.lstTime = this.utilitiesService.getHours();

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

      this.storeTimings = [] as TimingsModel[];
      let weekDayIndex = 0;
      this.fg.get('timingsGroup')?.value.forEach((item: any) => {
        let storeTiming = {} as TimingsModel;
        storeTiming.CloseHrs = this.utilitiesService.getUTCDate(item.CloseHrs);
        storeTiming.DayOfWeek = weekDayIndex;
        storeTiming.IsAllDayOpen = item.IsAllDayOpen ? true : false;
        storeTiming.IsNextDay = item.IsNextDay ? true : false;
        storeTiming.OpenHrs = this.utilitiesService.getUTCDate(item.OpenHrs);

        switch(this.tag) {
          case 'menu': {
            storeTiming.MenuId = this.RefId;
            // storeTiming.CategoryId = 0;
            // storeTiming.StoreId = 0;
          } break;
          case 'category': {
            // storeTiming.MenuId = 0;
            storeTiming.CategoryId = this.RefId;
            // storeTiming.StoreId = 0;
          } break;
          case 'store': {
            // storeTiming.MenuId = 0;
            // storeTiming.CategoryId = 0;
            storeTiming.StoreId = this.RefId;
          } break;
          default: break;
        }

        storeTiming.Id = this.isEdit ? item.Id : 0;

        this.storeTimings.push(storeTiming);
        weekDayIndex++;
      });

      this.saveChanges.emit(this.storeTimings);
    });
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.weekTimings) {
      if (this.weekTimings?.length) {
        let timings = this.weekTimings;

        (this.fg.get('timingsGroup') as FormArray).controls.forEach((item: any, index: number) => {
          Object.keys(item.controls).forEach((key, cindex) => {

            switch(key) {
              case "CloseHrs": {
                if (timings[index]?.CloseHrs) {
                  item.controls[key].setValue(timings[index].CloseHrs);
                }
              } break;
              case "DayOfWeek": {
                if (timings[index]?.DayOfWeek) {
                  item.controls[key].setValue(timings[index].DayOfWeek);
                }
              } break;
              case "IsAllDayOpen": {
                if (timings[index]?.IsAllDayOpen) {
                  item.controls[key].setValue(timings[index].IsAllDayOpen);
                  }
                } break;
              case "IsNextDay": {
                if (timings[index]?.IsNextDay) {
                  item.controls[key].setValue(timings[index].IsNextDay);
                  }
                } break;
              case "OpenHrs": {
                if (timings[index]?.OpenHrs) {
                  item.controls[key].setValue(timings[index].OpenHrs);
                  }
                } break;
              case "StoreId": {
                if (timings[index]?.StoreId) {
                  item.controls[key].setValue(timings[index].StoreId);
                  }
                } break;
              case "Id": {
                  if (timings[index]?.Id) {
                    item.controls[key].setValue(timings[index].Id);
                  }
                } break;
              default: break;
            }
          });
        });
      }
    }
  }
}
