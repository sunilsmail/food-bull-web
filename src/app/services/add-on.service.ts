import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WebConfiguration } from '../helpers/web-configuration';
import { AddOnModel } from '../shared/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class AddOnService {

  constructor(private httpService: HttpClient) {}

  createAddOn(addOnModel: AddOnModel): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.post(`${WebConfiguration.ApiUrl}/AddOn/CreateAddOn`, addOnModel).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  getAddOn(addOnId: number): Observable<AddOnModel> {
    return new Observable<AddOnModel>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/AddOn/GetAddOn/${addOnId}`).subscribe(
            (result) => observer.next(result as AddOnModel),
            error => observer.error(error));
          });
  }

  updateAddOnStatus(addOnId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/AddOn/UpdateAddOnStatus/${addOnId}`).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  updateAddOnOrder(itemId: number, addOnModels: AddOnModel[]): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.put(`${WebConfiguration.ApiUrl}/AddOn/UpdateAddOnOrder/${itemId}`, addOnModels).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  getAllAddOns(): Observable<AddOnModel[]> {
    return new Observable<AddOnModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/AddOn/GetAllAddOns`).subscribe(
            (result) => observer.next(result as AddOnModel[]),
            error => observer.error(error));
          });
  }

  getAddOnsByStoreId(storeId: number): Observable<AddOnModel[]> {
    return new Observable<AddOnModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/AddOn/GetAddOnsByStoreId/${storeId}`).subscribe(
            (result) => observer.next(result as AddOnModel[]),
            error => observer.error(error));
          });
  }

  getAddOnsByCategoryId(categoryId: number): Observable<AddOnModel[]> {
    return new Observable<AddOnModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/AddOn/GetAddOnsByCategoryId/${categoryId}`).subscribe(
            (result) => observer.next(result as AddOnModel[]),
            error => observer.error(error));
          });
  }

  getAddOnsByItemId(itemId: number): Observable<AddOnModel[]> {
    return new Observable<AddOnModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/AddOn/GetAddOnsByItemId/${itemId}`).subscribe(
            (result) => observer.next(result as AddOnModel[]),
            error => observer.error(error));
          });
  }

  deleteAddon(addOnId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.delete(`${WebConfiguration.ApiUrl}/AddOn/DeleteAddon/${addOnId}`).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

}
