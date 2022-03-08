import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { WebConfiguration } from '../helpers/web-configuration';
import { ContactModel, StoresModel, StoreSpecialDayModel, StoreAdvancedOptionsModel, TimingsModel } from '../shared/app-interfaces';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor(
    private httpService: HttpClient,
    private httpBackendService: HttpClient,
    httpBackend: HttpBackend
  ) {
    this.httpBackendService = new HttpClient(httpBackend);
  }

  getStores(): Observable<StoresModel[]> {
    return new Observable<StoresModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Store/GetStores`).subscribe(
          (result) => observer.next(result as StoresModel[]),
          error => observer.error(error));
        });
  }

  getStoresByStoreGroupId(storeGroupId: number): Observable<StoresModel[]> {
    return new Observable<StoresModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Store/GetStoresByStoreGroupId/${storeGroupId}`).subscribe(
            (result) => observer.next(result as StoresModel[]),
            error => observer.error(error));
          });
  }

  getStoreTimingsByStoreId(storeId: number): Observable<TimingsModel[]> {
    return new Observable<TimingsModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Store/GetStoreTimingsByStoreId/${storeId}`).subscribe(
            (result) => observer.next(result as TimingsModel[]),
            error => observer.error(error));
          });
  }

  getStoreSpecialDaysByStoreId(storeId: number): Observable<StoreSpecialDayModel[]> {
    return new Observable<StoreSpecialDayModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Store/GetStoreSpecialDaysByStoreId/${storeId}`).subscribe(
            (result) => observer.next(result as StoreSpecialDayModel[]),
            error => observer.error(error));
          });
  }

  createStore(storeModel: StoresModel): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.post(`${WebConfiguration.ApiUrl}/Store/CreateStore`, storeModel).subscribe(
            (result) =>observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  getBasicStore(storeId: number): Observable<StoresModel> {
    return new Observable<StoresModel>
    (observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Store/GetBasicStore/${storeId}`)
          .subscribe(
            (result) => { observer.next(result as StoresModel); },
            error => { observer.error(error); }
          );
    });
  }

  updateStore(storeId: number, storeModel: any): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpService.put(`${WebConfiguration.ApiUrl}/Store/UpdateStore/${storeId}`, storeModel, { headers: reqHeaders })
          .subscribe(
            (result) => { observer.next(result as boolean); },
            error => { observer.error(error); }
          );
    });
  }

  addTimingsToStore(storeId: number, storeTimingsModels: any): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpService.put(`${WebConfiguration.ApiUrl}/Store/AddTimingsToStore/${storeId}`, storeTimingsModels, { headers: reqHeaders })
          .subscribe(
            (result) => { observer.next(result as boolean); },
            error => { observer.error(error); }
          );
    });
  }

  setStoreIsOnline(storeId: number, isOnline: boolean): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.put(`${WebConfiguration.ApiUrl}/Store/SetStoreIsOnline/${storeId}/${isOnline}`, '').subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error))});
  }

  getStoreIsOnline(storeId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Store/GetStoreIsOnline/${storeId}`).subscribe(
        result => observer.next(result as boolean))
    });
  }

  updateStoreAdvancedOptions(storeAdvancedOptionsModel: StoreAdvancedOptionsModel): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.post(`${WebConfiguration.ApiUrl}/Store/UpdateStoreAdvancedOptions`, storeAdvancedOptionsModel).subscribe(
          (result) => observer.next(result as boolean),
          error => observer.error(error));
    });
  }

  addSpecialDaysToStore(storeId: number, storeSpecialDayModel: any): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpService.put(`${WebConfiguration.ApiUrl}/Store/AddSpecialDaysToStore/${storeId}`, storeSpecialDayModel, { headers: reqHeaders })
        .subscribe(
          (result) => { observer.next(result as boolean); },
          error => { observer.error(error); }
        );
    });
  }

  updateSpecialDay(specialDayId: number, storeSpecialDayModel: any): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpService.put(`${WebConfiguration.ApiUrl}/Store/UpdateSpecialDay/${specialDayId}`, storeSpecialDayModel, { headers: reqHeaders })
        .subscribe(
          (result) => { observer.next(result as boolean); },
          error => { observer.error(error); }
        );
    });
  }

  getContactsByStoreId(storeId: number): Observable<ContactModel[]> {
    return new Observable<ContactModel[]>
    (observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Store/GetContactsByStoreId/${storeId}`)
        .subscribe(
          (result) => { observer.next(result as ContactModel[]); },
          error => { observer.error(error); }
        );
    });
  }

  getContactsByStoreGroupId(storeGroupId: number): Observable<ContactModel[]> {
    return new Observable<ContactModel[]>
    (observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Store/GetContactsByStoreGroupId/${storeGroupId}`)
        .subscribe(
          (result) => { observer.next(result as ContactModel[]); },
          error => { observer.error(error); }
        );
    });
  }

  createContact(storeId: number, contactModel: any): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpService.put(`${WebConfiguration.ApiUrl}/Store/CreateContact/${storeId}`, contactModel, { headers: reqHeaders })
        .subscribe(
          (result) => { observer.next(result as boolean); },
          error => { observer.error(error); }
        );
    });
  }

  updateContact(contactId: number, contactModel: any): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpService.put(`${WebConfiguration.ApiUrl}/Store/UpdateContact/${contactId}`, contactModel, { headers: reqHeaders })
        .subscribe(
          (result) => { observer.next(result as boolean); },
          error => { observer.error(error); }
        );
    });
  }

  deleteStoreContact(storeId: number, contactId: number): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.delete(`${WebConfiguration.ApiUrl}/Store/DeleteStoreContact/${storeId}/${contactId}`)
        .subscribe(
          (result) => { observer.next(result as boolean); },
          error => { observer.error(error); }
        );
    });
  }

  deleteStoreGroupContact(storeGroupId: number, contactId: number): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.delete(`${WebConfiguration.ApiUrl}/Store/DeleteStoreGroupContact/${storeGroupId}/${contactId}`)
        .subscribe(
          (result) => { observer.next(result as boolean); },
          error => { observer.error(error); }
        );
    });
  }

  deleteStoreImage(storeId: number, imageId: number): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.delete(`${WebConfiguration.ApiUrl}/Store/DeleteStoreImage/${storeId}/${imageId}`)
        .subscribe(
          (result) => { observer.next(result as boolean); },
          error => { observer.error(error); }
        );
    });
  }

  deleteSpecialDay(storeId: number, storeSpecialDayId: number): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.delete(`${WebConfiguration.ApiUrl}/Store/DeleteSpecialDay/${storeId}/${storeSpecialDayId}`)
        .subscribe(
          (result) => { observer.next(result as boolean); },
          error => { observer.error(error); }
        );
    });
  }

}
