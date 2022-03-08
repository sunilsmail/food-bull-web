import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];
    private loadInitiated = false;

    constructor(
      private spinner: NgxSpinnerService
    ) { }

    removeRequest(req: HttpRequest<any>) {
        const i = this.requests.indexOf(req);
        if (i >= 0) {
            this.requests.splice(i, 1);
        }

        if (this.requests.length === 0) {
            this.hideLoader();
            this.loadInitiated = false;
        }
    }

    showLoader() {
      this.spinner.show();
    }

    hideLoader() {
      this.spinner.hide();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.requests.push(req);
        if (!this.loadInitiated) {
            this.loadInitiated = true;
            this.showLoader();
        }
        return new Observable(observer => {
            const subscription = next.handle(req)
                .subscribe(
                    event => {
                        if (event instanceof HttpResponse) {
                            this.removeRequest(req);
                            observer.next(event);
                        }
                    },
                    err => {
                        this.removeRequest(req);
                        observer.error(err);
                    },
                    () => {
                        this.removeRequest(req);
                        observer.complete();
                    });
            // remove request from queue when cancelled
            return () => {
                this.removeRequest(req);
                subscription.unsubscribe();
            };
        });
    }
}
