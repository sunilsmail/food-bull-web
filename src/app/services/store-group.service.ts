import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  WebConfiguration,
} from '../helpers/web-configuration';
import { StoreGroupModel } from '../shared/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class StoreGroupService {
  constructor(
    private httpService: HttpClient
  ) {}

  getStoreGroups(): Observable<StoreGroupModel[]> {
    return new Observable<StoreGroupModel[]>
    (observer => {
      this.httpService
        .get(`${WebConfiguration.ApiUrl}/StoreGroup/GetStoreGroups`)
        .subscribe(
          (result) => {
            var data = result as StoreGroupModel[];
            observer.next(data);
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  createStoreGroup(storeGroupModel: StoreGroupModel): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService
        .post(`${WebConfiguration.ApiUrl}/StoreGroup/CreateStoreGroup`, storeGroupModel)
        .subscribe(
          (result) => {
            var data = result as boolean;
            observer.next(data);
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  updateStoreGroup(storeGroupId: number, storeGroupModel: any): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpService
        .put(`${WebConfiguration.ApiUrl}/StoreGroup/UpdateStoreGroup/${storeGroupId}`, storeGroupModel, { headers: reqHeaders })
        .subscribe(
          (result) => {
            var data = result as boolean;
            observer.next(data);
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  getStoreGroup(storeGroupId: number): Observable<StoreGroupModel> {
    return new Observable<StoreGroupModel>
    (observer => {
      this.httpService
        .get(`${WebConfiguration.ApiUrl}/StoreGroup/GetStoreGroup/${storeGroupId}`)
        .subscribe(
          (result) => {
            var data = result as StoreGroupModel;
            observer.next(data);
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  deleteStoreGroupImage(storeGroupId: number, imageId: number): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService
        .delete(`${WebConfiguration.ApiUrl}/StoreGroup/DeleteStoreGroupImage/${storeGroupId}/${imageId}`)
        .subscribe(
          (result) => {
            var data = result as boolean;
            observer.next(data);
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

}
