import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export abstract class ApiBaseService {

  protected abstract endpoint: string;
  protected abstract http: HttpClient;

  public requestOptions: {
    headers?: HttpHeaders | {[header: string]: string | string[]},
    observe?: 'body' | 'events' | 'response',
    params?: HttpParams|{[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>},
    reportProgress?: boolean,
    responseType?: any|'arraybuffer'|'blob'|'json'|'text',
    withCredentials?: boolean,
  }

  constructor() {
    this.requestOptions = { withCredentials: true };
  }

  // private getApiRoot() {
  //   return `${environment.apiUrl}`;
  // }

  // get<TResult>(action: string = '', params?: HttpParams) {
  //   return this.http.get<TResult>(this.getApiRoot() + this.endpoint + action,
  //     params ? { ...this.requestOptions, params } : this.requestOptions);
  // }

  // post<TBody, TResult>(action: string = '', body: TBody = {}, params?: HttpParams) {
  //   return this.http.post<TResult>(this.getApiRoot() + this.endpoint + action, body,
  //     params ? { ...this.requestOptions, params } : this.requestOptions);
  // }

  // patch<TBody, TResult>(action: string = '', body: TBody = null, params?: HttpParams) {
  //   return this.http.patch<TResult>(this.getApiRoot() + this.endpoint + action, body,
  //     params ? { ...this.requestOptions, params } : this.requestOptions);
  // }

  // put<TBody, TResult>(action: string = '', body: TBody = null, params?: HttpParams) {
  //   return this.http.put<TResult>(this.getApiRoot() + this.endpoint + action, body,
  //     params ? { ...this.requestOptions, params } : this.requestOptions);
  // }

  // delete<TBody, TResult>(action: string = '', params?: HttpParams) {
  //   return this.http.delete<TResult>(this.getApiRoot() + this.endpoint + action,
  //     params ? { ...this.requestOptions, params } : this.requestOptions);
  // }

}
