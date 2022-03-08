import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WebConfiguration } from '../helpers/web-configuration';
import { ServicesModel } from '../shared/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class MasterServicesService {

  constructor(private httpService: HttpClient) {}

  getAllServices(): Observable<ServicesModel[]> {
    return new Observable<ServicesModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Service/GetAllServices`).subscribe(
            (result) => observer.next(result as ServicesModel[]),
            error => observer.error(error));
          });
  }

  getAllActiveServices(): Observable<ServicesModel[]> {
    return new Observable<ServicesModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Service/GetAllActiveServices`).subscribe(
            (result) => observer.next(result as ServicesModel[]),
            error => observer.error(error));
          });
  }

  createService(servicesModel: ServicesModel): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.post(`${WebConfiguration.ApiUrl}/Service/CreateService`, servicesModel).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  getService(serviceId: number): Observable<ServicesModel> {
    return new Observable<ServicesModel>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Service/GetService/${serviceId}`).subscribe(
            (result) => observer.next(result as ServicesModel),
            error => observer.error(error));
          });
  }

  updateServiceStatus(serviceId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Service/UpdateServiceStatus/${serviceId}`).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  updateService(serviceId: number, servicesModel: ServicesModel): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.put(`${WebConfiguration.ApiUrl}/Service/UpdateService/${serviceId}`, servicesModel).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  deleteService(serviceId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.delete(`${WebConfiguration.ApiUrl}/Service/DeleteService/${serviceId}`).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }
}
