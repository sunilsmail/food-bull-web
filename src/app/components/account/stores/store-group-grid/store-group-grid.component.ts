import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StoreGroupModel, StoresModel } from 'src/app/shared/app-interfaces';
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';
import { StoreGroupService } from 'src/app/services/store-group.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'foodbull-store-group-grid',
  templateUrl: './store-group-grid.component.html',
  styleUrls: ['./store-group-grid.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StoreGroupGridComponent implements OnInit, AfterViewInit {

  private subscription: Subscription[] = [];

  expandedElement = {} as StoreGroupModel;
  displayedColumnsSubStore: string[] = ['indicator', 'Logo', 'Name', 'AccountNo', 'Address', 'Phone'];
  dataSourceSingleSubStore = new MatTableDataSource<StoresModel>();

  displayedColumns: string[] = ['indicator', 'Logo', 'Name', 'AccountNo', 'Address', 'Phone'];
  dataSource = new MatTableDataSource<StoreGroupModel>();
  @ViewChild(MatPaginator, {static: true}) paginator = {} as MatPaginator;
  @ViewChild(MatSort, {static: true}) sort = {} as MatSort;

  constructor(
    private storeGroupService: StoreGroupService,
    private utilitiesService: UtilitiesService,
    private storeService: StoreService,
  ) { }

  ngOnInit(): void {
    this.bindStoreGroups();
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Rows';
  }

  getSubDataStore(list: StoresModel[]): MatTableDataSource<StoresModel> {
    return new MatTableDataSource<StoresModel>(list);
  }

  bindStoreGroups(): void {
    this.subscription.push(
      this.storeGroupService
          .getStoreGroups()
          .subscribe(data => {
            this.dataSource = new MatTableDataSource<StoreGroupModel>(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, errors => {
            this.utilitiesService.showHttpError(errors);
          }));
  }

  getStores(expandedElement: StoreGroupModel, element: StoreGroupModel) {
    // expandedElement = expandedElement === element ? null : element;
    if (this.utilitiesService.checkNull(element.Stores) || element.Stores?.length == 0) {
      this.subscription.push(
        this.storeService
            .getStoresByStoreGroupId(element.Id)
            .subscribe(data => {
              element.Stores = JSON.parse(JSON.stringify(data));
              this.dataSourceSingleSubStore = new MatTableDataSource<StoresModel>(data);
            }, errors => {
              this.utilitiesService.showHttpError(errors);
            }));
        }
  }

  applyFilter(filter: any) {
    let source;

    source = this.dataSource;
    source.filter = filter.value.trim().toLowerCase();

    if (source.paginator) {
      source.paginator.firstPage();
    }
  }
}
