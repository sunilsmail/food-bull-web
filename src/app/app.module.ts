import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

import { LoaderInterceptor } from 'src/app/helpers/loader-interceptor';
import { RequestInterceptor } from 'src/app/helpers/request-interceptor';
import { ErrorInterceptor } from 'src/app/helpers/error-interceptor';
import { SharedModule } from './shared/app-shared.module';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/login/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
