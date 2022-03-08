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
import { ConfirmDialogModel, AllergenTagsModel } from 'src/app/shared/app-interfaces';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { ConfirmDialogComponent } from 'src/app/components/generic/confirm-dialog/confirm-dialog.component';
import { AddAllergensTagsComponent } from '../add-allergens-tags/add-allergens-tags.component';
import { AllergenTagsService } from 'src/app/services/allergen-tags.service';

@Component({
  selector: 'foodbull-allergens-tags-view',
  templateUrl: './allergens-tags-view.component.html',
  styleUrls: ['./allergens-tags-view.component.scss']
})
export class AllergensTagsViewComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  search = '';
  pageTitle = '' as string;
  public frameHeight: any;

  displayedColumns: string[] = ['Name', 'Description', 'IsActive', 'Actions'];
  dataSource = new MatTableDataSource<AllergenTagsModel>();
  @ViewChild(MatPaginator, {static: true}) paginator = {} as MatPaginator;
  @ViewChild(MatSort, {static: true}) sort = {} as MatSort;

  constructor(
    private titleService: Title,
    private allergenTagsService: AllergenTagsService,
    private utilitiesService: UtilitiesService,
    public dialog: MatDialog,
    private windowRef: WindowRef,
    private alertService: AlertMessageService
  ) {
    this.titleService.setTitle(`Allergens & Tags | ${WebConfiguration.AppName}`);
    this.pageTitle = 'Allergens & Tags';
    this.frameHeight = this.windowRef.nativeWindow.innerHeight - 200;
  }

  ngOnInit(): void {
    this.bindAllAlergensTags();
  }

  bindAllAlergensTags(): void {
    this.subscription.push(this.allergenTagsService.getAllAlergensTags().subscribe(data => {
            this.dataSource = new MatTableDataSource<AllergenTagsModel>(data);
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
      allergenId: null
    }

    const dialogRef = this.dialog.open(AddAllergensTagsComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindAllAlergensTags();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  edit(item: AllergenTagsModel): void {
    if (this.utilitiesService.checkNull(item)) {
      return;
    }

    let obj = {
      allergenId: item.Id
    }
    const dialogRef = this.dialog.open(AddAllergensTagsComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindAllAlergensTags();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  delete(item: AllergenTagsModel): void {
    const dialogData = new ConfirmDialogModel(`CONFIRM`, 'Are you sure you want to delete ?', 'delete_outline');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.subscription.push(this.allergenTagsService.deleteAllergenTags(item.Id).subscribe((result: boolean) => {
                this.alertService.SnackBarWithActions('Deleted successfully', 'Close');
              }, errors => this.utilitiesService.showHttpError(errors)));
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}
