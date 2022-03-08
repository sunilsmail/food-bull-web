import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WebConfiguration } from '../helpers/web-configuration';
import { AllergenTagsModel } from '../shared/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class AllergenTagsService {

  constructor(private httpService: HttpClient) {}

  getAllAlergensTags(): Observable<AllergenTagsModel[]> {
    return new Observable<AllergenTagsModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/AllergenTags/GetAllAlergensTags`).subscribe(
            (result) => observer.next(result as AllergenTagsModel[]),
            error => observer.error(error));
          });
  }

  getAllActiveAlergensTags(): Observable<AllergenTagsModel[]> {
    return new Observable<AllergenTagsModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/AllergenTags/GetAllActiveAlergensTags`).subscribe(
            (result) => observer.next(result as AllergenTagsModel[]),
            error => observer.error(error));
          });
  }

  createAllergenTags(allergenTagsModel: AllergenTagsModel): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.post(`${WebConfiguration.ApiUrl}/AllergenTags/CreateAllergenTags`, allergenTagsModel).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  getAllergenTags(allergenTagsId: number): Observable<AllergenTagsModel> {
    return new Observable<AllergenTagsModel>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/AllergenTags/GetAllergenTags/${allergenTagsId}`).subscribe(
            (result) => observer.next(result as AllergenTagsModel),
            error => observer.error(error));
          });
  }

  updateAllergenTagsStatus(allergenTagsId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/AllergenTags/UpdateAllergenTagsStatus/${allergenTagsId}`).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  updateAllergenTags(allergenTagsId: number, allergenTagsModel: AllergenTagsModel): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.put(`${WebConfiguration.ApiUrl}/AllergenTags/UpdateAllergenTags/${allergenTagsId}`, allergenTagsModel).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  deleteAllergenTags(allergenTagsId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.delete(`${WebConfiguration.ApiUrl}/AllergenTags/DeleteAllergenTags/${allergenTagsId}`).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }
}
