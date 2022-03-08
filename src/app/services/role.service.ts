import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  WebConfiguration,
} from '../helpers/web-configuration';
import { RoleModel } from '../shared/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(
    private httpService: HttpClient
  ) {}

  createRole(roleModel: RoleModel): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService
        .post(`${WebConfiguration.ApiUrl}/Roles/CreateRole`, roleModel)
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

  getRoles(): Observable<RoleModel[]> {
    return new Observable<RoleModel[]>
    (observer => {
      this.httpService
        .get(`${WebConfiguration.ApiUrl}/Roles/GetRoles`)
        .subscribe(
          (result) => {
            var data = result as RoleModel[];
            observer.next(data);
          },
          error => {
            observer.error(error);
          }
        );
    });
  }
}
