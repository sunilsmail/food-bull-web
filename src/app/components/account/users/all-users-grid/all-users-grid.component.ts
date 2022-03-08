import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { Subscription } from 'rxjs';
import { WindowRef } from 'src/app/services/window.service';
import { ConfirmDialogModel, UserModel } from 'src/app/shared/app-interfaces';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';

@Component({
  selector: 'foodbull-all-users-grid',
  templateUrl: './all-users-grid.component.html',
  styleUrls: ['./all-users-grid.component.scss']
})
export class AllUsersGridComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  search = '';
  pageTitle = '' as string;
  public frameHeight: any;

  displayedColumns: string[] = ['Name', 'Role', 'AssignedStore', 'Email', 'Actions'];
  dataSource = new MatTableDataSource<UserModel>();
  @ViewChild(MatPaginator, {static: true}) paginator = {} as MatPaginator;
  @ViewChild(MatSort, {static: true}) sort = {} as MatSort;

  constructor(
    private alertService: AlertMessageService,
    private userService: UserService,
    private utilitiesService: UtilitiesService,
    public dialog: MatDialog,
    private windowRef: WindowRef,
  ) {
    this.frameHeight = this.windowRef.nativeWindow.innerHeight - 200;
  }

  ngOnInit(): void {
    this.bindUsers();
  }

  bindUsers(): void {
    this.subscription.push(
      this.userService
          .getAllUsers()
          .subscribe(data => {
            this.dataSource = new MatTableDataSource<UserModel>(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, errors => {
            this.utilitiesService.showHttpError(errors);
          }));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.frameHeight = this.windowRef.nativeWindow.innerHeight - 200;
  }

  applyFilter(filter: any) {
    this.dataSource.filter = filter.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteUser(item: UserModel) {

    const dialogData = new ConfirmDialogModel(`DELETE USER ${item.FirstName} ${item.LastName}`, 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    // dialogRef.afterClosed().subscribe(dialogResult => {
    //   if (dialogResult) {
    //     this.subscription.push(
    //       this.userService
    //           .deleteUser(item.Id)
    //           .subscribe((result: boolean) => {
    //             this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
    //             this.bindUsers();
    //           }, errors => { this.utilitiesService.showHttpError(errors); }));
    //   }
    // });
  }


  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}

