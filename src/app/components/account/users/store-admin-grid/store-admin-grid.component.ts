import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { Subscription } from 'rxjs';
import { WindowRef } from 'src/app/services/window.service';
import { UserModel } from 'src/app/shared/app-interfaces';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'foodbull-store-admin-grid',
  templateUrl: './store-admin-grid.component.html',
  styleUrls: ['./store-admin-grid.component.scss']
})
export class StoreAdminGridComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  search = '';
  pageTitle = '' as string;
  public frameHeight: any;

  displayedColumns: string[] = ['Name', 'Role', 'AssignedStore', 'Email', 'Actions'];
  dataSource = new MatTableDataSource<UserModel>();
  @ViewChild(MatPaginator, {static: true}) paginator = {} as MatPaginator;
  @ViewChild(MatSort, {static: true}) sort = {} as MatSort;

  constructor(
    private userService: UserService,
    private utilitiesService: UtilitiesService,
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

  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}

