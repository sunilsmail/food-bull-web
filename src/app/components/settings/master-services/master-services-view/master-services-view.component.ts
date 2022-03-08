import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { WebConfiguration } from 'src/app/helpers/web-configuration';
import { Subscription } from 'rxjs';
import { WindowRef } from 'src/app/services/window.service';
import { ConfirmDialogModel, ServicesModel } from 'src/app/shared/app-interfaces';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { MasterServicesService } from 'src/app/services/master-service.service';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';
import { AddMasterServiceComponent } from '../add-master-service/add-master-service.component';

@Component({
  selector: 'foodbull-master-services-view',
  templateUrl: './master-services-view.component.html',
  styleUrls: ['./master-services-view.component.scss']
})
export class MasterServicesViewComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  search = '';
  pageTitle = '' as string;
  public frameHeight: any;

  displayedColumns: string[] = ['Name', 'Description', 'IsActive', 'Actions'];
  dataSource = new MatTableDataSource<ServicesModel>();
  @ViewChild(MatPaginator, {static: true}) paginator = {} as MatPaginator;
  @ViewChild(MatSort, {static: true}) sort = {} as MatSort;

  constructor(
    private titleService: Title,
    private masterServicesService: MasterServicesService,
    private utilitiesService: UtilitiesService,
    public dialog: MatDialog,
    private windowRef: WindowRef,
    private alertService: AlertMessageService
  ) {
    this.titleService.setTitle(`Services | ${WebConfiguration.AppName}`);
    this.pageTitle = 'Services';
    this.frameHeight = this.windowRef.nativeWindow.innerHeight - 200;
  }

  ngOnInit(): void {
    this.bindServices();
  }

  bindServices(): void {
    this.subscription.push(this.masterServicesService.getAllServices().subscribe(data => {
            this.dataSource = new MatTableDataSource<ServicesModel>(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, errors => this.utilitiesService.showHttpError(errors)));
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

  add(): void {
    let obj = {
      serviceId: null
    }

    const dialogRef = this.dialog.open(AddMasterServiceComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindServices();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  edit(item: ServicesModel): void {
    if (this.utilitiesService.checkNull(item)) {
      return;
    }

    let obj = {
      serviceId: item.Id
    }
    const dialogRef = this.dialog.open(AddMasterServiceComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindServices();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  delete(item: ServicesModel): void {
    const dialogData = new ConfirmDialogModel(`CONFIRM`, 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(this.masterServicesService.deleteService(item.Id).subscribe((result: boolean) => {
                this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
              }, errors => this.utilitiesService.showHttpError(errors)));
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}
