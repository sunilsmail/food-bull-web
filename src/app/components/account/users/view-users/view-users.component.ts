import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Title } from '@angular/platform-browser';
import {
  MatDialog,
} from '@angular/material/dialog';
import { WebConfiguration } from 'src/app/helpers/web-configuration';
import { Subscription } from 'rxjs';
import { WindowRef } from 'src/app/services/window.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { ConfirmDialogModel, RoleModel, UserModel } from 'src/app/shared/app-interfaces';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { ViewUserComponent } from '../view-user/view-user.component';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService } from 'src/app/services/role.service';

@Component({
  selector: 'foodbull-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  fg = {} as FormGroup;
  search = '';
  pageTitle = '' as string;
  public frameHeight: any;
  lstRoles = [] as RoleModel[];

  displayedColumns: string[] = ['Name', 'RoleName', 'AssignedStore', 'Email', 'Actions'];
  dataSource = new MatTableDataSource<UserModel>();
  @ViewChild(MatPaginator, {static: true}) paginator = {} as MatPaginator;
  @ViewChild(MatSort, {static: true}) sort = {} as MatSort;

  constructor(
    private titleService: Title,
    public dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private userService: UserService,
    private alertService: AlertMessageService,
    private windowRef: WindowRef,
    private rolesService: RolesService,
    private formBuilder: FormBuilder
    ) {
    this.titleService.setTitle(`Users | ${WebConfiguration.AppName}`);
    this.pageTitle = 'Users';
    this.frameHeight = this.windowRef.nativeWindow.innerHeight - 200;
  }

  ngOnInit(): void {
    this.fg = this.formBuilder.group({
      RoleCtrl: new FormControl('All')
    });

    this.bindRoles();

    this.bindUsers();

    this.fg.controls["RoleCtrl"].valueChanges.subscribe(value => {
      if (value) {
        this.applyFilter('RoleName', value);
      }
    })
  }

  bindRoles() {
    this.subscription.push(
      this.rolesService.getRoles().subscribe(data => {
        this.lstRoles = data;

        this.lstRoles.unshift({ Id: 0, Name: 'All', Description: 'all' });

      }, errors => this.utilitiesService.showHttpError(errors)));
  }

  bindUsers(): void {
    this.subscription.push(
      this.userService.getAllUsers()
          .subscribe(data => {
            if (data.length) {
              data.forEach(item => {
                item.RoleName = item.Role?.Name;
              });
            }

            this.dataSource = new MatTableDataSource<UserModel>(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.dataSource.filterPredicate =
                (data: any, filtersJson: string) => {
                    const matchFilter: any = [];
                    const filters = JSON.parse(filtersJson);

                    filters.forEach((filter: any) => {
                      const val = data[filter.id] === null ? '' : data[filter.id];
                      matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
                    });
                      return matchFilter.every(Boolean);
                  };

            this.applyFilter('RoleName', 'All');

          }, errors => {
            this.utilitiesService.showHttpError(errors);
          }));
  }

  applyFilter(columnName: string, filter: any) {
    var tableFilters: any[] = [];
    filter = filter == 'All' ? '' : filter;

    tableFilters.push({
      id: columnName,
      value: filter
    });

    setTimeout(() => {
      this.dataSource.filter = JSON.stringify(tableFilters);
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }, 100);
  }



  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.frameHeight = this.windowRef.nativeWindow.innerHeight - 200;
  }

  addUser() {
    let obj = {
      userId: null,
      storeId: null,
      store: null
    }
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindUsers();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  editUser(item: UserModel) {
    let obj = {
      userId: item.Id,
      storeId: null,
      store: null
    }
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindUsers();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  viewUser(item: UserModel) {
    const dialogRef = this.dialog.open(ViewUserComponent, {
      data: { regItem: item },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindUsers();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  deleteUser(item: UserModel) {
    const dialogData = new ConfirmDialogModel(`DELETE USER ${item.FirstName} ${item.LastName}`, 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(
          this.userService
              .deleteUser(item.Id)
              .subscribe((result: boolean) => {
                this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
                this.bindUsers();
              }, errors => { this.utilitiesService.showHttpError(errors); }));
      }
    });
  }


  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}

