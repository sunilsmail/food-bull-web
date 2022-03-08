import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WebConfiguration, } from '../helpers/web-configuration';
import { CountryModel, StateModel, CityModel, ItemTypeModel, DashboardCountModel, StoreStatusModel } from '../shared/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private httpService: HttpClient) {}

  getStoreStatusAdvancedOptions(): StoreStatusModel[] {
    return [
      { Id: 1, Name: 'On Hold' },
      { Id: 2, Name: 'Active' },
      { Id: 3, Name: 'Suspend' }
    ] as StoreStatusModel[];
  }

  getItemTypes(): ItemTypeModel[] {
    return [
      { Id: 1, Name: 'Single' },
      { Id: 2, Name: 'Combo' },
      { Id: 3, Name: 'Pizza' }
    ] as ItemTypeModel[];
  }

  getAllCountries(): Observable<CountryModel[]> {
    return new Observable<CountryModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Common/GetAllCountries`).subscribe(
          (result) => observer.next(result as CountryModel[]), error => observer.error(error));
        });
  }

  getStatesByCountryId(countryId: number): Observable<StateModel[]> {
    return new Observable<StateModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Common/GetStatesByCountryId/${countryId}`).subscribe(
          (result) => observer.next(result as StateModel[]), error => observer.error(error));
    });
  }

  getCitiesByStatedId(stateId: number): Observable<CityModel[]> {
    return new Observable<CityModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Common/GetCitiesByStatedId/${stateId}`).subscribe(
          (result) => observer.next(result as CityModel[]), error => observer.error(error));
    });
  }

  searchLocation(strLocation: string): Observable<CityModel[]> {
    return new Observable<CityModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Common/SearchLocation/${strLocation}`).subscribe(
          (result) => observer.next(result as CityModel[]), error => observer.error(error));
    });
  }

  getDashboardCount(): Observable<DashboardCountModel> {
    return new Observable<DashboardCountModel>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Common/GetDashboardCount`).subscribe(
          (result) => observer.next(result as DashboardCountModel), error => observer.error(error));
    });
  }


}
