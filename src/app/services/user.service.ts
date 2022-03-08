import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  WebConfiguration,
} from '../helpers/web-configuration';
import { AssignRoleToUserModel, CreateUserModel, UserModel } from '../shared/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private httpService: HttpClient
  ) {}

  createUser(createUser: UserModel): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService
        .post(`${WebConfiguration.ApiUrl}/User/CreateUser`, createUser)
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

  updateUser(userId: number, createUser: any): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpService
        .put(`${WebConfiguration.ApiUrl}/User/UpdateUser/${userId}`, createUser, { headers: reqHeaders })
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

  getAllUsers(): Observable<UserModel[]> {
    return new Observable<UserModel[]>
    (observer => {
      this.httpService
        .get(`${WebConfiguration.ApiUrl}/User/GetAllUsers`)
        .subscribe(
          (result) => {
            var data = result as UserModel[];
            observer.next(data);
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  getUsersByStoreId(storeId: number): Observable<UserModel[]> {
    return new Observable<UserModel[]>
    (observer => {
      this.httpService
        .get(`${WebConfiguration.ApiUrl}/User/GetUsersByStoreId/${storeId}`)
        .subscribe(
          (result) => {
            var data = result as UserModel[];
            observer.next(data);
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  getUserById(userId: number): Observable<UserModel> {
    return new Observable<UserModel>
    (observer => {
      this.httpService
        .get(`${WebConfiguration.ApiUrl}/User/GetUserById/${userId}`)
        .subscribe(
          (result) => {
            var data = result as UserModel;
            observer.next(data);
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  deleteUserByStoreId(storeId: number, userId: number): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService
        .delete(`${WebConfiguration.ApiUrl}/User/DeleteUserByStoreId/${storeId}/${userId}`)
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

  deleteUser(userId: number): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService
        .delete(`${WebConfiguration.ApiUrl}/User/DeleteUser/${userId}`)
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

  assignRoleToUser(assignRoleToUserModel: AssignRoleToUserModel): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService
        .post(`${WebConfiguration.ApiUrl}/User/AssignRoleToUser`, assignRoleToUserModel)
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
