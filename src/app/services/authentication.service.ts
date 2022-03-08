import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StorageClientService } from './storage-client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebConfiguration, TokenConfiguration } from '../helpers/web-configuration';
import { ForgotPasswordModel, LocalStorageUserInfo, TokenHolder, UserCredentialsModel } from 'src/app/shared/app-interfaces';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  role: any;
  authState = new BehaviorSubject(false);
  constructor(
    private httpService: HttpClient,
    private router: Router,
    private storage: StorageClientService,
    private utilitiesService: UtilitiesService,
    private storeService: StoreService
  ) {
    this.ifLoggedIn();
  }

  ifLoggedIn() {
    const accessTokenStorage = this.storage.get(`${WebConfiguration.SID}ACCESS_TOKEN`);
    if (accessTokenStorage) {
      TokenConfiguration.RefreshInitiator = false;
      TokenConfiguration.AccessToken = accessTokenStorage;
      this.authState.next(true);

      // this.verifyAccessToken(accessTokenStorage)
      //     .then(result => {
      //     if (result === true) {
      //       this.authState.next(true);
      //     } else {
      //       // this.navigatToLogin();
      //     }
      // });
    } else {
      // this.navigatToLogin();
    }
  }

  checkLoginStatus(): boolean {
    const result = JSON.parse(this.storage.get(`${WebConfiguration.SID}USERINFO`));
    if (!this.utilitiesService.checkNull(result)) {
        return true;
    }
    return false;
  }

  navigatToLogin() {
    this.router.navigateByUrl('/login');
  }

  verifyAccessToken(accessToken: string) {
    // const promise = new Promise((resolve, reject) => {
    //   this.httpService
    //     .get(`${WebConfiguration.ApiUrl}/Login/Authorize`)
    //     .subscribe(
    //       result => {
    //         const res = result === true;
    //         resolve(res);
    //         this.authState.next(res);
    //       },
    //       error => {
    //         resolve(false);
    //       }
    //     );
    // });
    // return promise;
  }

  authenticate(cred: UserCredentialsModel): Observable<TokenHolder> {
    return new Observable<TokenHolder>(observer => {
      this.httpService.post(`${WebConfiguration.ApiUrl}/Login/ValidateLogin`, cred).subscribe(
        (result) => {
              let token = result as TokenHolder;

              this.storeToken(token, cred);
              this.authState.next(true);
              observer.next(token);
            }, error => observer.error(error));
          });
  }

  storeToken(token: TokenHolder, cred: UserCredentialsModel) {
    if (!this.utilitiesService.checkNull(token)) {
      cred.Password =  btoa(cred.Password);
      this.storage.clear();
      this.storage.set(`${WebConfiguration.SID}REMEMBERME`, cred.RememberMe);
      if (cred.RememberMe) {
        this.storage.set(`${WebConfiguration.SID}EMAIL`, cred.EmailAddress);
        this.storage.set(`${WebConfiguration.SID}PASSWORD`, cred.Password);
      }
      this.storage.set(`${WebConfiguration.SID}ACCESS_TOKEN`, token.AccessToken);
      this.storage.set(`${WebConfiguration.SID}REFRESH_TOKEN`, token.RefreshToken);

      TokenConfiguration.AccessToken = token.AccessToken;
      TokenConfiguration.RefreshToken = token.RefreshToken;

      this.storage.remove(`${WebConfiguration.SID}USERINFO`);
      const userInfo = {} as LocalStorageUserInfo;
      userInfo.Name = token.Name;
      userInfo.UserName = token.UserName;
      userInfo.RoleName = token.RoleName;

      if (token.StoreId) {
        userInfo.StoreId = token.StoreId;
        this.storeService.setStoreIsOnline(token.StoreId, true).subscribe();
      }
      this.storage.set(`${WebConfiguration.SID}USERINFO`, JSON.stringify(userInfo));
    }
  }

  forgotPasswordLink(emailAddress: string): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService
        .get(`${WebConfiguration.ApiUrl}/Login/ForgotPasswordLink/${emailAddress}`)
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

  forgotPassword(forgotPassword: ForgotPasswordModel): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService
        .post(`${WebConfiguration.ApiUrl}/Login/ForgotPassword`, forgotPassword)
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

  logOut() {
    let user = this.utilitiesService.getLocalUser();
    if (user) {
      this.storeService.setStoreIsOnline(user.StoreId, false).subscribe();
    }

    const rememberMe = this.storage.get(`${WebConfiguration.SID}REMEMBERME`);
    if (!rememberMe) {
      this.storage.remove(`${WebConfiguration.SID}EMAIL`);
      this.storage.remove(`${WebConfiguration.SID}PASSWORD`);
      this.storage.remove(`${WebConfiguration.SID}REMEMBERME`);
    }

    const removeAccessTokenPromise = this.storage.remove(`${WebConfiguration.SID}ACCESS_TOKEN`);
    const removeRefreshTokenPromise = this.storage.remove(`${WebConfiguration.SID}REFRESH_TOKEN`);
    const userInfo = this.storage.remove(`${WebConfiguration.SID}USERINFO`);

    forkJoin([removeAccessTokenPromise, removeRefreshTokenPromise, userInfo]).subscribe(
      () => {
        TokenConfiguration.AccessToken = '';
        TokenConfiguration.RefreshToken = '';
        this.router.navigate(['login']);
        this.authState.next(false);
      },
      error => {
        // const errorStr = JSON.stringify(error);
      }
    );
  }

  isAuthenticated() {
    return this.authState.value;
  }
}
