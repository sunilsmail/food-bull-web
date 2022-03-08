import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WebConfiguration } from '../helpers/web-configuration';
import { HierarchyModel, MenuModel, SubHierarchyModel } from '../shared/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private httpService: HttpClient) {}

  getMenusByStoreId(storeId: number): Observable<MenuModel[]> {
    return new Observable<MenuModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Menu/GetMenusByStoreId/${storeId}`).subscribe(
          (result) => {
            var data = result as MenuModel[];
            observer.next(data);
          }, error => observer.error(error));
        });
  }

  getAllMenus(): Observable<MenuModel[]> {
    return new Observable<MenuModel[]>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Menu/GetAllMenus`).subscribe(
          (result) => {
            var data = result as MenuModel[];
            observer.next(data);
          }, error => observer.error(error));
        });
  }

  createMenu(menuModel: MenuModel): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.post(`${WebConfiguration.ApiUrl}/Menu/CreateMenu`, menuModel).subscribe(
          (result) => {
            var data = result as boolean;
            observer.next(data);
          }, error => observer.error(error));
        });
  }

  getHierarchyMenu(menuId: number): Observable<HierarchyModel> {
    return new Observable<HierarchyModel>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Menu/GetHierarchyMenu/${menuId}`).subscribe(
          (result) => {
            var data = result as HierarchyModel;
            observer.next(data);
          }, error => observer.error(error));
        });
  }

  // getNewHierarchyMenu(menuId: number): Observable<HierarchyModel> {
  //   return new Observable<HierarchyModel>(observer => {
  //     this.httpService.get(`${WebConfiguration.ApiUrl}/Menu/GetNewHierarchyMenu/${menuId}`).subscribe(
  //         (result) => {
  //           var data = result as HierarchyModel;
  //           observer.next(data);
  //         }, error => observer.error(error));
  //       });
  // }

  menuCopyHierarchyModel(hierarchyModel: HierarchyModel): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.post(`${WebConfiguration.ApiUrl}/Menu/MenuCopyHierarchyModel`, hierarchyModel).subscribe(
          (result) => {
            var data = result as boolean;
            observer.next(data);
          }, error => observer.error(error));
        });
  }

  updateMenu(menuId: number, menuModel: MenuModel): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.put(`${WebConfiguration.ApiUrl}/Menu/UpdateMenu/${menuId}`, menuModel).subscribe(
          (result) => {
            var data = result as boolean;
            observer.next(data);
          }, error => observer.error(error));
        });
  }

  getMenu(menuId: number): Observable<MenuModel> {
    return new Observable<MenuModel>(observer => {
      this.httpService.get(`${WebConfiguration.ApiUrl}/Menu/GetMenu/${menuId}`).subscribe(
          (result) => {
            var data = result as MenuModel;
            observer.next(data);
          }, error => observer.error(error));
        });
  }

  deleteMenuByStoreId(storeId: number, menuId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.delete(`${WebConfiguration.ApiUrl}/Menu/DeleteMenuByStoreId/${storeId}/${menuId}`).subscribe(
          (result) => {
            var data = result as boolean;
            observer.next(data);
          }, error => observer.error(error));
        });
  }
}
