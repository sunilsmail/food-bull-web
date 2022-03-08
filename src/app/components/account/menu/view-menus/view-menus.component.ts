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
import { HierarchyModel, MenuModel, SubHierarchyModel } from 'src/app/shared/app-interfaces';
import { MenuService } from 'src/app/services/menu.service';
import { AddMenuComponent } from '../add-menu/add-menu.component';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { ViewMenuComponent } from '../view-menu/view-menu.component';
import { CopyMenuTreeModalComponent } from '../copy-menu-tree-modal/copy-menu-tree-modal.component';

@Component({
  selector: 'foodbull-view-menus',
  templateUrl: './view-menus.component.html',
  styleUrls: ['./view-menus.component.scss']
})
export class ViewMenusComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  search = '';
  pageTitle = '' as string;
  public frameHeight: any;

  displayedColumns: string[] = ['MenuName', 'AssignedTo', 'Actions'];
  dataSource = new MatTableDataSource<MenuModel>();
  @ViewChild(MatPaginator, { static: false }) paginator = {} as MatPaginator;
  @ViewChild(MatSort, { static: false }) sort = new MatSort();

  constructor(
    private titleService: Title,
    private menuService: MenuService,
    private utilitiesService: UtilitiesService,
    public dialog: MatDialog,
    private windowRef: WindowRef,
    private alertService: AlertMessageService
  ) {
    this.titleService.setTitle(`Menu | ${WebConfiguration.AppName}`);
    this.pageTitle = 'Menu';
    this.frameHeight = this.windowRef.nativeWindow.innerHeight - 200;
  }

  ngOnInit(): void {
    this.bindMenus();
  }

  bindMenus(): void {
    this.subscription.push(this.menuService.getAllMenus().subscribe(data => {
            this.dataSource = new MatTableDataSource<MenuModel>(data);
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

  addMenu() {
    let obj = {
      menuId: null
    }
    const dialogRef = this.dialog.open(AddMenuComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindMenus();
      }
    });

    dialogRef.backdropClick().subscribe(result => {
      this.alertService.SnackBarWithActions('Click on close button', 'Close');
    });
  }

  viewMenu(item: MenuModel): void {
    const dialogRef = this.dialog.open(ViewMenuComponent, {
      data: { regItem: item },
      panelClass: 'dialog-40'
    });
  }

  copyMenu(menuId: number): void {

    if (menuId <= 0) {
      return;
    }

    this.subscription.push(
      this.menuService.getHierarchyMenu(menuId).subscribe((result: HierarchyModel) => {
            if (result) {

              let obj = {
                treeData: result
              }

              const dialogRef = this.dialog.open(CopyMenuTreeModalComponent, {
                data: { regItem: obj },
                panelClass: 'dialog-40',
                disableClose: true
              });

              dialogRef.afterClosed().subscribe(result => {
                if (result === 'reload') {
                  this.bindMenus();
                }
              });

              dialogRef.backdropClick().subscribe(result => {
                this.alertService.SnackBarWithActions('Click on close button', 'Close');
              });
            }
          }, errors => this.utilitiesService.showHttpError(errors)));
  }

  editMenu(item: MenuModel): void {
    if (this.utilitiesService.checkNull(item)) {
      return;
    }

    let obj = {
      menuId: item.Id
    }
    const dialogRef = this.dialog.open(AddMenuComponent, {
      data: { regItem: obj },
      panelClass: 'dialog-40',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.bindMenus();
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

