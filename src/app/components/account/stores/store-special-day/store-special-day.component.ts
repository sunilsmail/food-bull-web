import { Component, ViewChild, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmDialogModel, StoreSpecialDayModel } from 'src/app/shared/app-interfaces';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { MatDialog } from '@angular/material/dialog';
import { AddSpecialDayComponent } from '../add-special-day/add-special-day.component';
import { StoreService } from 'src/app/services/store.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ViewSpecialDayComponent } from '../view-special-day/view-special-day.component';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';
import { AlertMessageService } from 'src/app/services/alert-message.service';

@Component({
  selector: 'foodbull-store-special-day',
  templateUrl: './store-special-day.component.html',
  styleUrls: ['./store-special-day.component.scss']
})
export class StoreSpecialDayComponent implements OnChanges, OnDestroy {

  @Input() storeId: number = 0;

  private subscription: Subscription[] = [];
  lstStoreSpecialDays: StoreSpecialDayModel[] = [];
  displayedColumnsSpecialDays: string[] = ['Day', 'OpeningHour', 'ClosingHour', 'Description', 'Status', 'Actions'];
  dataSourceSpecialDays = new MatTableDataSource<StoreSpecialDayModel>();
  @ViewChild(MatSort, { static: false }) sort = new MatSort();

  constructor(
    private utilitiesService: UtilitiesService,
    public dialog: MatDialog,
    private storeService: StoreService,
    private alertService: AlertMessageService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.storeId) {
        this.bindSpecialDaysByStoreId();
      }
  }

  addSpecialDay(): void {
    if (this.utilitiesService.checkNull(this.storeId)) {
      return;
    }

    let obj = {
      storeId: this.storeId,
      item: null
    }

    const dialogRef = this.dialog.open(AddSpecialDayComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindSpecialDaysByStoreId();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  bindSpecialDaysByStoreId(): void {
    if (!(this.storeId && this.storeId > 0)) {
      return;
    }

    this.subscription.push(this.storeService.getStoreSpecialDaysByStoreId(this.storeId).subscribe(
            data => {
              this.lstStoreSpecialDays = [] as StoreSpecialDayModel[];
              this.lstStoreSpecialDays = JSON.parse(JSON.stringify(data));

              this.dataSourceSpecialDays = new MatTableDataSource<StoreSpecialDayModel>(data);
              setTimeout(() => {
                this.dataSourceSpecialDays.sort = this.sort;
              }, 100);
            },
            error => this.utilitiesService.showHttpError(error)));
  }

  viewSpecialDay(item: StoreSpecialDayModel): void {
    if (this.utilitiesService.checkNull(item)) {
      return;
    }

    const dialogRef = this.dialog.open(ViewSpecialDayComponent, {
      data: { regItem: item },
      panelClass: 'dialog-30'
    });
  }

  deleteSpecialDay(item: StoreSpecialDayModel): void {
    if (this.utilitiesService.checkNull(item)) {
      return;
    }

    const dialogData = new ConfirmDialogModel('DELETE SPECIAL DAY', 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(this.storeService.deleteSpecialDay(this.storeId, item.Id).subscribe(
          (result: boolean) => {
              this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
              this.bindSpecialDaysByStoreId();
            }, errors => this.utilitiesService.showHttpError(errors)));
      }
    });
  }

  editSpecialDay(item: StoreSpecialDayModel): void {
    if (this.utilitiesService.checkNull(item)) {
      return;
    }

    let obj = {
      storeId: this.storeId,
      item: item
    }

    const dialogRef = this.dialog.open(AddSpecialDayComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindSpecialDaysByStoreId();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  ngOnDestroy(): void {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }

}
