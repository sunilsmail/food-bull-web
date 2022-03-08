import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  WebConfiguration,
} from '../helpers/web-configuration';
import { ItemModel } from '../shared/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private httpService: HttpClient) {}

  /**
  * Get all item under particular category,
   * @param categoryId number
   * @returns ItemModel[]
  */
  getItems(categoryId: number): Observable<ItemModel[]> {
    return new Observable<ItemModel[]>
    (observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Item/GetItems/${categoryId}`)
          .subscribe(
            (result) => { observer.next(result as ItemModel[]); },
            error => { observer.error(error); }
          );
    });
  }

  updateStatus(itemId: number): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Item/UpdateStatus/${itemId}`)
          .subscribe(
            (result) => { observer.next(result as boolean); },
            error => { observer.error(error); }
          );
    });
  }

  updateItemStatus(itemId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Item/UpdateItemStatus/${itemId}`).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  createItem(itemModel: ItemModel): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.post(`${WebConfiguration.ApiUrl}/Item/CreateItem`, itemModel)
          .subscribe(
            (result) => { observer.next(result as boolean); },
            error => { observer.error(error); }
          );
    });
  }

  updateItemOrder(categoryId: number, itemModels: ItemModel[]): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.put(`${WebConfiguration.ApiUrl}/Item/UpdateItemOrder/${categoryId}`, itemModels).subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
          });
  }

  updateItem(itemId: number, ItemModel: ItemModel): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.put(`${WebConfiguration.ApiUrl}/Item/UpdateItem/${itemId}`, ItemModel)
          .subscribe(
            (result) => { observer.next(result as boolean); },
            error => { observer.error(error); }
          );
    });
  }

  updateOrder(selectedOrder: number, itemModel: ItemModel): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.put(`${WebConfiguration.ApiUrl}/Item/UpdateOrder/${selectedOrder}`, itemModel)
          .subscribe(
            (result) => observer.next(result as boolean),
            error => observer.error(error));
    });
  }

  getItem(itemId: number): Observable<ItemModel> {
    return new Observable<ItemModel>
    (observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Item/GetItem/${itemId}`)
          .subscribe(
            (result) => { observer.next(result as ItemModel); },
            error => { observer.error(error); }
          );
    });
  }

  deleteItem(itemId: number): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.delete(`${WebConfiguration.ApiUrl}/Item/DeleteItem/${itemId}`)
          .subscribe(
            (result) => { observer.next(result as boolean); },
            error => { observer.error(error); }
          );
    });
  }

  deleteItemImage(itemId: number, imageId: number): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.delete(`${WebConfiguration.ApiUrl}/Item/DeleteItemImage/${itemId}/${imageId}`)
          .subscribe(
            (result) => { observer.next(result as boolean); },
            error => { observer.error(error); }
          );
    });
  }

}
