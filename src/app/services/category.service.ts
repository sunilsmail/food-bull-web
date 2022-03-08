import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WebConfiguration } from '../helpers/web-configuration';
import { CategoryModel } from '../shared/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpService: HttpClient) {}

  getCategories(storeId: number, menuId: number): Observable<CategoryModel[]> {
    return new Observable<CategoryModel[]>
    (observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Category/GetCategories/${storeId}/${menuId}`)
          .subscribe(
            (result) => { observer.next(result as CategoryModel[]); },
            error => { observer.error(error); }
          );
    });
  }

  createCategory(categoryModel: CategoryModel): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.post(`${WebConfiguration.ApiUrl}/Category/CreateCategory`, categoryModel)
          .subscribe(
            (result) => { observer.next(result as boolean); },
            error => { observer.error(error); }
          );
    });
  }

  updateCategory(categoryId: number, categoryModel: CategoryModel): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.put(`${WebConfiguration.ApiUrl}/Category/UpdateCategory/${categoryId}`, categoryModel)
          .subscribe(
            (result) => { observer.next(result as boolean); },
            error => { observer.error(error); }
          );
    });
  }

  getCategory(categoryId: number): Observable<CategoryModel> {
    return new Observable<CategoryModel>
    (observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Category/GetCategory/${categoryId}`)
          .subscribe(
            (result) => { observer.next(result as CategoryModel); },
            error => { observer.error(error); }
          );
    });
  }

  deleteCategory(storeId: number, menuId: number, categoryId: number): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService.delete(`${WebConfiguration.ApiUrl}/Category/DeleteCategory/${storeId}/${menuId}/${categoryId}`)
          .subscribe(
            (result) => { observer.next(result as boolean); },
            error => { observer.error(error); }
          );
    });
  }

}
