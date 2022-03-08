import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { WebConfiguration } from 'src/app/helpers/web-configuration';
import { Observable } from 'rxjs';
import { WindowRef } from 'src/app/services/window.service';
import { AddStoreGroupComponent } from '../add-store-group/add-store-group.component';
import { StoresModel } from 'src/app/shared/app-interfaces';
import { AddSingleStoreComponent } from '../add-single-store/add-single-store.component';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { StoreGridComponent } from '../store-grid/store-grid.component';
import { StoreGroupGridComponent } from '../store-group-grid/store-group-grid.component';
import { AlertMessageService } from 'src/app/services/alert-message.service';

@Component({
  selector: 'app-view-stores',
  templateUrl: './view-stores.component.html',
  styleUrls: ['./view-stores.component.scss']
})
export class ViewStoresComponent implements AfterViewInit, OnDestroy {
  search = '';
  pageTitle = '' as string;
  public frameHeight: any;

  currentTabIndex: number = 0;
  isOnlineStatus$: Observable<boolean>;
  @ViewChild('tabGroup', { static: false }) tabGroup!: MatTabGroup;
  @ViewChild('storeGrid', { static: false }) storeGridComponent!: StoreGridComponent;
  @ViewChild('storeGroupGrid', { static: false }) storeGroupGridComponent!: StoreGroupGridComponent;

  constructor(
    private titleService: Title,
    public dialog: MatDialog,
    private windowRef: WindowRef,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertMessageService
  ) {
    this.titleService.setTitle(`Stores | ${WebConfiguration.AppName}`);
    this.pageTitle = 'Stores';
    this.frameHeight = this.windowRef.nativeWindow.innerHeight - 200;
    this.isOnlineStatus$ = {} as Observable<boolean>;
  }

  ngAfterViewInit() {
    this.activatedRoute.queryParams.subscribe(param => {
      this.tabGroup.selectedIndex = param.tab;
    });
  }

  getStatus(store: StoresModel) {

    // return interval(5000).pipe(map(() =>
    //       {
    //         let httpRequest = new HttpRequest('GET', `${WebConfiguration.ApiUrl}/Store/GetStoreIsOnline/${store.Id}`);
    //         const handler = new HttpInterceptorHandler(this.httpBackend);
    //         this.httpBackend.handle(httpRequest).pipe(
    //           tap((ev: HttpEvent<any>) => {
    //             console.log('processing response', ev);
    //             if (ev instanceof HttpResponse) {
    //               console.log('processing response', ev);
    //             }
    //           })
    //         );
    //       }
    //     ))

    // return interval(5000).pipe(map(() => {
    //     return new Observable<boolean>(observer =>
    //       this.httpBackendService.get(`${WebConfiguration.ApiUrl}/Store/GetStoreIsOnline/${storeId}`).subscribe(res => observer.next(res as boolean)) ); }))


    // console.log(this.httpBackendService.get(`${WebConfiguration.ApiUrl}/Store/GetStoreIsOnline/${storeId}`).pipe(map((response) => { return response as boolean })));
    // return this.httpBackendService.get(`${WebConfiguration.ApiUrl}/Store/GetStoreIsOnline/${storeId}`).pipe(map((response) => { return response as boolean }))


    //   let res: boolean = false;
    //   this.storeService.getStoreIsOnline(storeId).subscribe(result => res = result );
    //   return res;
    // });
  }

  selectedTabChange(ev: any) {
    this.currentTabIndex = ev.index;
    // if (ev.index >= 0) {
    //   switch (ev.index) {
    //     case 0: this.bindSingleStores(); break;
    //     case 1: this.bindStoreGroups(); break;
    //     default: break;
    //   }
    // }
  }

  createSingleStore() {
    const dialogRef = this.dialog.open(AddSingleStoreComponent, {
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.tabGroup.selectedIndex = 0;
        this.storeGridComponent.bindSingleStores();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  createStoreGroup() {
    const dialogRef = this.dialog.open(AddStoreGroupComponent, {
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.tabGroup.selectedIndex = 1;
        this.storeGroupGridComponent.bindStoreGroups();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  ngOnDestroy() {
  }
}

