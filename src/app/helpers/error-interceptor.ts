import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { TokenConfiguration } from './web-configuration';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
      private injector: Injector
      ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                if (TokenConfiguration.RefreshInitiator === false) {
                    const authService = this.injector.get(AuthenticationService);
                    TokenConfiguration.RefreshInitiator = true;
                } else {
                    const authService = this.injector.get(AuthenticationService);
                    authService.logOut();
                }
            }
            const error = err.error.message || err.statusText;
            return throwError(err);
        }));
    }
}
