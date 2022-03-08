import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpError, ErrorType, LocalStorageUserInfo } from '../shared/app-interfaces';
import { AlertMessageService } from '../services/alert-message.service';
import { FormGroup } from '@angular/forms';
import { WebConfiguration } from './web-configuration';
import { StorageClientService } from '../services/storage-client.service';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor(
    public datepipe: DatePipe,
    private alertService: AlertMessageService,
    private storage: StorageClientService
  ) {}

  /**
   * @param value string
   * @returns hyphen saperated string
   * Convert a complex string to hyphen saperated string.
   * String which includes Spaces, Special characters etc., are removed and hyphen saperated string is returned.
   *
   * Generally used to generate neat route url.
   */
  convertSpacesToHyphen(value: string): string {
    const separators = [' ', '\\+', '-', '\\(', '\\)', '\\*', '/', ':', '\\?'];
    const splitArr = value.split(new RegExp(separators.join('|'), 'g'));
    const result = splitArr.filter(Boolean).join('-');
    return result.toLowerCase();
  }

  /**
   * Checks the input value is [undefined or null],
   * If value satisfies the condition return's true orelse return's false.
   * @param value any
   * @returns boolean
   */
  checkNull(value: any): boolean {
    if (typeof value === 'undefined' || value === null) {
      return true;
    }
    return false;
  }

  /**
   * Checks the input value is [undefined or null or length equal to 0]
   * If value satisfies the condition return's 'true' orelse return's 'false'
   * @param value any
   * @returns boolean
   */
  checkNullAndLength(value: any): boolean {
    if (typeof value === 'undefined' || value === null || value.length === 0) {
      return true;
    }
    return false;
  }

  showHttpError(httpError: HttpError, formGroup?: FormGroup) {
    if (!this.checkNull(httpError)) {
      if (typeof httpError === 'string' || httpError instanceof String) {
        this.alertService.SnackBarWithActions(httpError.toString(), 'Close');
      } else {
        if (httpError.error != null && httpError.status === 400 && !this.checkNull(formGroup)) {
          if (Object.prototype.toString.call(httpError.error) === '[object Object]') {
            this.alertService.SnackBarWithActions(httpError.error.Message, 'Close');
            if (!this.checkNull(httpError.error.FieldName) && !this.checkNull(formGroup)) {
              for (const key in formGroup?.controls) {
                if (formGroup?.controls.hasOwnProperty(key)) {
                  if (key === httpError.error.FieldName) {
                    formGroup?.controls[key].setErrors({
                      serverError: httpError.error.Message
                    });
                  }
                }
              }
            }

          } else if (Object.prototype.toString.call(httpError.error) === '[object Array]') {
            httpError.error.forEach((element: any) => {
              for (const key in formGroup?.controls) {
                if (formGroup?.controls.hasOwnProperty(key)) {
                  if (key === element.FieldName) {
                    formGroup?.controls[key].setErrors({
                      serverError: element.Message
                    });
                  }
                }
              }
            });
          }
        } else {
          const error = httpError.error as any;
          if (typeof error === 'undefined' || error === null) {
            this.alertService.SnackBarWithActions('Error Occurred', 'Close');
          } else if (
            Object.prototype.toString.call(error) === '[object ProgressEvent]'
          ) {
            this.alertService.SnackBarWithActions(httpError.statusText, 'Close');
          } else if (
            Object.prototype.toString.call(error) === '[object Array]' &&
            error.length > 0
          ) {
            const lstErrors = error as ErrorType[];
            lstErrors.forEach((c) => {
              this.alertService.SnackBarWithActions(c.Message, 'Close');
            });
          } else if (
            Object.prototype.toString.call(error) === '[object ErrorType]'
          ) {
            this.alertService.SnackBarWithActions(error.Message, 'Close');
          } else if (
            Object.prototype.toString.call(error) === '[object Object]'
          ) {
            this.alertService.SnackBarWithActions(error.Message, 'Close');
            if (!this.checkNull(error.FieldName) && !this.checkNull(formGroup)) {
              for (const key in formGroup?.controls) {
                if (formGroup?.controls.hasOwnProperty(key)) {
                  if (key === error.FieldName) {
                    formGroup?.controls[key].setErrors({
                      serverError: error.Message
                    });
                  }
                }
              }
            }

          } else {
            this.alertService.SnackBarWithActions(error, 'Close');
          }
        }
      }
    }
  }

  getUTCDate(date: any) {
    if (
      typeof date !== 'undefined' &&
      date != null &&
      !isNaN(Date.parse(date))
    ) {
      const dateFormat = new Date(date);
      return new Date(
        dateFormat.getTime() - dateFormat.getTimezoneOffset() * 60000
      ).toISOString();
    }
    return date;
  }

  getDefaultDateFormat(date: any) {
    if (typeof date !== 'undefined' && date != null && date.length > 0) {
      return this.datepipe.transform(date, 'dd/MM/yyyy');
    }
    return date;
  }

  enumSelector(definition: any) {
    return Object.keys(definition).filter(f => !isNaN(Number(f)));

  }

  /**
   * Generates a Date[] with timespan difference of 30mins.
   * @returns Date[] with timespan difference of 30minutes.
   */
  getHours(): Date[] {
    let dt = new Date();
    let date = dt.setHours(0,0,0,0);
    let dateWithTime = new Date(date).getTime();
    let lstTime = [];
    for (let i = 0; i < 48; i++) {
      dateWithTime = i == 0 ? dateWithTime : (dateWithTime + 30 * 60000);
      lstTime.push(new Date(dateWithTime));
    }

    return lstTime;
  }

  addZero(i: any) {
    if (i < 10) {i = "0" + i}
    return i;
  }

  getTimeSpanFormat(hours: number, minutes: number) {
    return this.addZero(hours) + ':' + this.addZero(minutes);
  }


  getLocalUser(): LocalStorageUserInfo {
    let user = JSON.parse(this.storage.get(`${WebConfiguration.SID}USERINFO`));
    return user ? user as LocalStorageUserInfo : {} as LocalStorageUserInfo;
  }


  getSuperAdminAccess(): boolean {
    let user = JSON.parse(this.storage.get(`${WebConfiguration.SID}USERINFO`));

    if (!user.RoleName) {
      return false;
    }

    return user.RoleName === "SuperAdmin";
  }

}
