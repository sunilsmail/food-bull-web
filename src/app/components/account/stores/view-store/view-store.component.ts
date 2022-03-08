import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { StoreService } from 'src/app/services/store.service';
import { ConfirmDialogModel, ContactModel, StoreStatusModel, MenuModel, StoresModel, StoreTimingsModel, UserModel, StoreAdvancedOptionsModel } from 'src/app/shared/app-interfaces';
import { interval, Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddStoreTimingsComponent } from '../add-store-timings/add-store-timings.component';
import { AddContactPersonComponent } from '../add-contact-person/add-contact-person.component';
import { DayOfWeek } from 'src/app/shared/app-enums';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { ViewContactPersonComponent } from '../view-contact-person/view-contact-person.component';
import { UserService } from 'src/app/services/user.service';
import { ViewUserComponent } from '../../users/view-user/view-user.component';
import { AddUserComponent } from '../../users/add-user/add-user.component';
import { MenuService } from 'src/app/services/menu.service';
import { AddMenuComponent } from '../../menu/add-menu/add-menu.component';
import { AddSingleStoreComponent } from '../add-single-store/add-single-store.component';
import { HttpClient, HttpHeaders, HttpRequest, HttpXhrBackend } from '@angular/common/http';
import { TokenConfiguration, WebConfiguration } from 'src/app/helpers/web-configuration';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.scss']
})
export class ViewStoreComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription: Subscription[] = [];

  Id: number = 0;
  private sub: any;
  store = {} as StoresModel;
  weekDays = DayOfWeek;

  displayedColumnsContacts: string[] = ['Name', 'Email', 'MobileNumber', 'Role', 'Actions'];
  dataSourceContacts = new MatTableDataSource<ContactModel>();
  @ViewChild(MatSort, {static: true}) sortContact = {} as MatSort;


  @ViewChild(MatSort, {static: true}) sortUsers = {} as MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorUsers = {} as MatPaginator;
  displayedColumnsStoreUser: string[] = ['Name', 'Role', 'Email', 'MobileNumber', 'Actions'];
  dataSourceStoreUser = new MatTableDataSource<UserModel>();

  @ViewChild(MatSort, {static: true}) sortMenus = {} as MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorMenus = {} as MatPaginator;
  displayedColumnsStoreMenu: string[] = ['MenuName', 'Description', 'Actions'];
  dataSourceStoreMenu = new MatTableDataSource<MenuModel>();

  public isOnline: boolean;
  reqHeaders = new HttpHeaders();
  advancedOptionsAccess: boolean = false;
  lstStatusAdvancedOptions = [] as StoreStatusModel[];
  fgStoreAdvancedOptions = {} as FormGroup;
  isAdvancedOptionsSubmitted: boolean = false;

  @ViewChild('tabGroup', { static: false }) tabGroup!: MatTabGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    private storeService: StoreService,
    private userService: UserService,
    private menuService: MenuService,
    public dialog: MatDialog,
    private httpBackend: HttpXhrBackend,
    private httpService: HttpClient,
    private alertService: AlertMessageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {
    this.isOnline = false;
    this.httpService = new HttpClient(httpBackend);

  }

  ngOnInit(): void {

    this.advancedOptionsAccess = this.utilitiesService.getSuperAdminAccess();
    if (this.advancedOptionsAccess) {
      this.lstStatusAdvancedOptions = this.commonService.getStoreStatusAdvancedOptions();

      this.fgStoreAdvancedOptions = this.formBuilder.group({
        StatusCtrl: new FormControl()
      });
    }

    this.store.TimingsModel = [] as StoreTimingsModel[];

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.Id = params.id;
      if (!this.utilitiesService.checkNull(this.Id) && this.Id > 0) {
        this.bindStoreDetails();
        this.getStoreIsOnline();
      }
    });
  }

  ngAfterViewInit(): void {
      this.activatedRoute.queryParams.subscribe(param => {
        this.tabGroup.selectedIndex = param.tab;
      });
  }

  selectedTabChange(ev: any) {
    if (ev.index >= 0) {
    }
  }

  getStoreIsOnline(): void {
    this.subscription.push(interval(5000).subscribe((val) => {
      this.httpService
          .get<boolean>(`${WebConfiguration.ApiUrl}/Store/GetStoreIsOnline/${this.Id}`, { headers: this.reqHeaders.set('Authorization', 'Bearer ' + TokenConfiguration.AccessToken)})
          .subscribe(res => { this.isOnline = res as boolean; console.log('status api call in view store page.'); })}));
  }

  bindStoreDetails(): void {
    if (!(this.Id && this.Id > 0)) {
      return;
    }

    this.subscription.push(
      this.storeService
          .getBasicStore(this.Id)
          .subscribe(
            data => {
              this.store = JSON.parse(JSON.stringify(data));
              this.bindStoreTimings();
              this.bindContactsByStoreId();
              this.bindUsersByStoreId();
              this.bindMenusByStoreId();
            },
            error => {
              this.utilitiesService.showHttpError(error);
            }))
  }

  editStore(): void {
    if (this.utilitiesService.checkNull(this.Id)) {
      return;
    }

    const dialogRef = this.dialog.open(AddSingleStoreComponent, {
      data: { storeId: this.Id },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindStoreDetails();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });

  }

  //#region ContactPerson
  addContactPerson(): void {
    if (this.utilitiesService.checkNull(this.store.Id)) {
      return;
    }

    let obj = {
      store: this.store,
      item: null,
      isStore: true
    }
    const dialogRef = this.dialog.open(AddContactPersonComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-30',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindContactsByStoreId();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  bindContactsByStoreId(): void {
    if (!(this.Id && this.Id > 0)) {
      return;
    }

    this.subscription.push(
      this.storeService
          .getContactsByStoreId(this.Id)
          .subscribe(
            data => {
              this.store.Contacts = [] as ContactModel[];
              this.store.Contacts = JSON.parse(JSON.stringify(data));

              this.dataSourceContacts = new MatTableDataSource<ContactModel>(data);
              this.dataSourceContacts.sort = this.sortContact;
            },
            error => { this.utilitiesService.showHttpError(error); }));
  }

  viewContact(item: ContactModel) {
    if (this.utilitiesService.checkNull(item)) {
      return;
    }

    const dialogRef = this.dialog.open(ViewContactPersonComponent, {
      data: { regItem: item },
      panelClass: 'dialog-30'
    });
  }

  deleteContact(item: ContactModel) {

    const dialogData = new ConfirmDialogModel('DELETE CONTACT PERSON', 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(
          this.storeService
              .deleteStoreContact(this.store.Id, item.Id)
              .subscribe((result: boolean) => {
                this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
                this.bindContactsByStoreId();
              }, errors => { this.utilitiesService.showHttpError(errors); }));
      }
    });
  }

  editContact(item: ContactModel) {
    if (this.utilitiesService.checkNull(this.store.Id)) {
      return;
    }

    let obj = {
      store: this.store,
      item: item,
      isStore: true
    }
    const dialogRef = this.dialog.open(AddContactPersonComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-30',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindContactsByStoreId();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }
  //#endregion ContactPerson

  //#region StoreTimings
  addStoreTimings(): void {
    if (this.utilitiesService.checkNull(this.Id)
    && this.utilitiesService.checkNull(this.store)) {
      return;
    }
    let obj = {
      store: this.store,
      item: null
    }

    const dialogRef = this.dialog.open(AddStoreTimingsComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindStoreTimings();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  bindStoreTimings(): void {
    if (!(this.Id && this.Id > 0)) {
      return;
    }

    this.subscription.push(
      this.storeService.getStoreTimingsByStoreId(this.Id).subscribe(
            data => this.store.TimingsModel = JSON.parse(JSON.stringify(data)),
            error => this.utilitiesService.showHttpError(error)));
  }

  editStoreTimings(): void {
    if (this.utilitiesService.checkNull(this.store.Id)) {
      return;
    }
    let obj = {
      store: this.store,
      items: this.store.TimingsModel
    }
    const dialogRef = this.dialog.open(AddStoreTimingsComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindStoreTimings();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  //#endregion StoreTimings


  //#region StoreUsers

  bindUsersByStoreId(): void {
    if (this.utilitiesService.checkNull(this.Id)) {
      return;
    }

    this.subscription.push(
      this.userService
          .getUsersByStoreId(this.Id)
          .subscribe(data => {
            this.dataSourceStoreUser = new MatTableDataSource<UserModel>(data);
            this.dataSourceStoreUser.paginator = this.paginatorUsers;
            this.dataSourceStoreUser.sort = this.sortUsers;
          }, errors => {
            this.utilitiesService.showHttpError(errors);
          }));
  }

  addUser() {
    if (this.utilitiesService.checkNull(this.Id)) {
      return;
    }

    let obj = {
      userId: null,
      storeId: this.Id,
      store: this.store
    }
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindUsersByStoreId();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  editUser(item: UserModel) {
    if (this.utilitiesService.checkNull(item)
    && this.utilitiesService.checkNull(this.Id)) {
      return;
    }

    let obj = {
      userId: item.Id,
      storeId: this.Id,
      store: this.store
    }
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindUsersByStoreId();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  viewUser(item: UserModel) {
    if (this.utilitiesService.checkNull(item)) {
      return;
    }

    const dialogRef = this.dialog.open(ViewUserComponent, {
      data: { regItem: item },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindUsersByStoreId();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  deleteUser(item: UserModel) {
    if (this.utilitiesService.checkNull(item)
    && this.utilitiesService.checkNull(this.Id)) {
      return;
    }

    const dialogData = new ConfirmDialogModel(`DELETE USER ${item.FirstName} ${item.LastName}`, 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(
          this.userService
              .deleteUserByStoreId(this.Id, item.Id)
              .subscribe((result: boolean) => {
                this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
                this.bindUsersByStoreId();
              }, errors => { this.utilitiesService.showHttpError(errors); }));
      }
    });
  }
  //#endregion StoreUsers

  //#region StoreMenu

  bindMenusByStoreId(): void {
    if (this.utilitiesService.checkNull(this.Id)) {
      return;
    }

    this.subscription.push(
      this.menuService
          .getMenusByStoreId(this.Id)
          .subscribe(data => {
            this.dataSourceStoreMenu = new MatTableDataSource<MenuModel>(data);
            this.dataSourceStoreMenu.paginator = this.paginatorMenus;
            this.dataSourceStoreMenu.sort = this.sortMenus;
          }, errors => {
            this.utilitiesService.showHttpError(errors);
          }));
  }

  addMenu() {
    let obj = {
      item: null,
      store: this.store
    }

    const dialogRef = this.dialog.open(AddMenuComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindMenusByStoreId();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  editStoreMenu(item: MenuModel) {
    if (this.utilitiesService.checkNull(item)) {
      return;
    }

    let obj = {
      menuId: item.Id,
      store: null
    }
    const dialogRef = this.dialog.open(AddMenuComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindMenusByStoreId();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  deleteStoreMenu(item: MenuModel) {
    if (this.utilitiesService.checkNull(this.Id)
    && this.utilitiesService.checkNull(item)) {
      return;
    }
    const dialogData = new ConfirmDialogModel(`DELETE MENU ${item.Name}`, 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(
          this.menuService
              .deleteMenuByStoreId(this.Id, item.Id)
              .subscribe((result: boolean) => {
                this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
                this.bindMenusByStoreId();
              }, errors => { this.utilitiesService.showHttpError(errors); }));
      }
    });
  }

  goToCategoryPage(menuId: number): void {
    if (this.utilitiesService.checkNull(this.store)
    && this.utilitiesService.checkNull(this.store.Id)
    && this.utilitiesService.checkNull(menuId)) {
      return;
    }
    let storeId = this.store.Id;

    this.router.navigate(['/account/menu/category', storeId, menuId])
  }
  //#endregion StoreMenu

  //#region StoreAdvanceOptions
  submitStoreAdvancedOptions(formGroup: FormGroup) {

    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {
      let storeAdvanceOptions = {} as StoreAdvancedOptionsModel;
      storeAdvanceOptions.Status = this.store.Status;
      storeAdvanceOptions.StoreId = this.store.Id;

      console.log(JSON.stringify(storeAdvanceOptions));

      this.subscription.push(this.storeService.updateStoreAdvancedOptions(storeAdvanceOptions).subscribe((result: boolean) => {
              if (result) {
                this.alertService.SnackBarWithActions('Settings updated successfully', 'Close');
                this.formAccessability(formGroup, true);
              }
            }, errors => {
              this.formAccessability(formGroup, true);
              this.utilitiesService.showHttpError(errors);
        }));
      }
  }

  formAccessability(formGroup: FormGroup, isEnable: boolean) {
    if (isEnable) {
      formGroup.enable();
      this.isAdvancedOptionsSubmitted = false;
    } else {
      formGroup.disable();
      this.isAdvancedOptionsSubmitted = true;
    }
  }
  //#endregion StoreAdvancedOptions End

  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}
