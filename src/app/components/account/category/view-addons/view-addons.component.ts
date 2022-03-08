import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AddOnModel, ConfirmDialogModel } from 'src/app/shared/app-interfaces';
import { AddOnService } from 'src/app/services/add-on.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';

@Component({
  selector: 'food-bull-view-addons',
  templateUrl: './view-addons.component.html',
  styleUrls: ['./view-addons.component.scss']
})
export class ViewAddonsComponent implements OnChanges {
  private subscription: Subscription[] = [];
  @Input() storeId: number = 0;

  isChangeOrderEnabled: boolean = false;
  displayedColumns: string[] = ['Sources', 'Actions'];
  dataSource = new MatTableDataSource<AddOnModel>();
  @ViewChild('table', { static: false }) table: MatTable<AddOnModel> = {} as MatTable<AddOnModel>;

  constructor(
    private alertService: AlertMessageService,
    public dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private addOnService: AddOnService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    let storeId = parseInt(changes.storeId.currentValue);
    if (storeId > 0) {
      this.bindData(storeId);
    }
  }

  dropTable(event: CdkDragDrop<MatTableDataSource<AddOnModel>>) {
    const prevIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource.data, prevIndex, event.currentIndex);
    let selectedOrder = event.currentIndex + 1;
  }

  bindData(storeId: number): void {
    this.subscription.push(this.addOnService.getAddOnsByStoreId(storeId).subscribe(data => {
      this.dataSource = new MatTableDataSource<AddOnModel>(data);
    }));
  }

  deleteItem(item: AddOnModel) {
    const dialogData = new ConfirmDialogModel(`DELETE ADDON ${item.Sources} `, 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(
          this.addOnService.deleteAddon(item.Id)
              .subscribe((result: boolean) => {
                this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
                this.bindData(this.storeId);
              }, errors => { this.utilitiesService.showHttpError(errors); }));
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  editItem(item: AddOnModel) {}

  enableChangeOrder(): void {
    this.isChangeOrderEnabled = !this.isChangeOrderEnabled;
  }

}
