import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageClientService } from '../services/storage-client.service';
import { TokenConfiguration } from './web-configuration';

@Injectable({ providedIn: 'root' })
export class RequestInterceptor implements HttpInterceptor {
    constructor(private storage: StorageClientService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headerData = req.headers;
        headerData = headerData.append('Authorization', 'Bearer ' + TokenConfiguration.AccessToken);
        if (req.url.indexOf('/RefreshToken') >= 0) {
            headerData = headerData.append('RefreshToken', TokenConfiguration.RefreshToken);
        }
        const authReq = req.clone({
            headers: headerData
        });
        return next.handle(authReq);
    }
}
