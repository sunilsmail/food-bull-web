import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { Subscription } from 'rxjs';
import { ConfirmDialogModel, ContactModel, StoreGroupModel, StoresModel } from 'src/app/shared/app-interfaces';
import { StoreGroupService } from 'src/app/services/store-group.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddContactPersonComponent } from '../add-contact-person/add-contact-person.component';
import { StoreService } from 'src/app/services/store.service';
import { ViewContactPersonComponent } from '../view-contact-person/view-contact-person.component';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { AddStoreGroupComponent } from '../add-store-group/add-store-group.component';

@Component({
  selector: 'app-view-store-group',
  templateUrl: './view-store-group.component.html',
  styleUrls: ['./view-store-group.component.scss']
})
export class ViewStoreGroupComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];

  Id: number = 0;
  private sub: any;
  store = {} as StoreGroupModel;
  displayedColumnsSingleStore: string[] = ['Logo', 'Name', 'AccountNo', 'Address', 'Phone'];
  dataSourceSingleStore = new MatTableDataSource<StoresModel>();
  @ViewChild(MatPaginator, {static: true}) paginator = {} as MatPaginator;
  @ViewChild(MatSort, {static: true}) sort = {} as MatSort;

  displayedColumnsContacts: string[] = ['Name', 'Email', 'MobileNumber', 'Role', 'Actions'];
  dataSourceContacts = new MatTableDataSource<ContactModel>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    public dialog: MatDialog,
    private alertService: AlertMessageService,
    private storeService: StoreService,
    private storeGroupService: StoreGroupService
  ) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.Id = params.id;
      if (!this.utilitiesService.checkNull(this.Id) && this.Id > 0) {
        this.bindStoreGroupDetails();
      }
    });
  }

  bindStoreGroupDetails(): void {
    this.subscription.push(
      this.storeGroupService
          .getStoreGroup(this.Id)
          .subscribe(
            data => {
              this.store = JSON.parse(JSON.stringify(data));
              this.bindStoresByStoreGroupId();
              this.bindContactsByStoreGroupId();
          },
          error => this.utilitiesService.showHttpError(error)));
  }

  bindStoresByStoreGroupId(): void {
    if (this.utilitiesService.checkNull(this.Id)) {
      return;
    }

    this.subscription.push(
      this.storeService
          .getStoresByStoreGroupId(this.Id)
          .subscribe(
            data => this.dataSourceSingleStore = new MatTableDataSource<StoresModel>(data),
            error => this.utilitiesService.showHttpError(error)));
  }

  editStoreGroup(): void {
    if (this.utilitiesService.checkNull(this.Id)) {
      return;
    }

    const dialogRef = this.dialog.open(AddStoreGroupComponent, {
      data: { storeGroupId: this.Id },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindStoresByStoreGroupId();
        this.bindStoreGroupDetails();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });

  }


  addContactPerson(): void {
    let obj = {
      store: this.store,
      item: null,
      isStore: false
    }
    const dialogRef = this.dialog.open(AddContactPersonComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindContactsByStoreGroupId();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  bindContactsByStoreGroupId(): void {
    if (this.utilitiesService.checkNull(this.Id)) {
      return;
    }

    this.subscription.push(
      this.storeService
          .getContactsByStoreGroupId(this.Id)
          .subscribe(
            data => {
              this.store.Contacts = [] as ContactModel[];
              this.store.Contacts = JSON.parse(JSON.stringify(data));

              this.dataSourceContacts = new MatTableDataSource<ContactModel>(data);
              this.dataSourceContacts.sort = this.sort;
            },
            error => {
              this.utilitiesService.showHttpError(error);
            }))
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

  deleteStoreGroupContact(item: ContactModel) {
    if (this.utilitiesService.checkNull(item)) {
      return;
    }

    const dialogData = new ConfirmDialogModel('DELETE CONTACT PERSON', 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(
          this.storeService
              .deleteStoreGroupContact(this.store.Id, item.Id)
              .subscribe((result: boolean) => {
                this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
                this.bindContactsByStoreGroupId();
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
      isStore: false
    }
    const dialogRef = this.dialog.open(AddContactPersonComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-30',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindContactsByStoreGroupId();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}
