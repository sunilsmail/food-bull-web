import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StoresModel } from 'src/app/shared/app-interfaces';
import { StoreService } from 'src/app/services/store.service';
import { Subscription } from 'rxjs';
import { UtilitiesService } from 'src/app/helpers/utilities';

@Component({
  selector: 'foodbull-store-grid',
  templateUrl: './store-grid.component.html',
  styleUrls: ['./store-grid.component.scss']
})
export class StoreGridComponent implements OnInit {
  private subscription: Subscription[] = [];

  searchStoreName: string = '';
  searchPhone: string = '';
  searchAddress: string = '';
  searchAccountNumber: string = '';

  displayedColumnsSingleStore: string[] = ['Logo', 'Name', 'AccountNo', 'Address', 'MobileNumber'];
  dataSourceSingleStore = new MatTableDataSource<StoresModel>();
  @ViewChild(MatPaginator, {static: true}) paginator = {} as MatPaginator;
  @ViewChild(MatSort, {static: true}) sort = {} as MatSort;

  constructor(
    private storeService: StoreService,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {
    this.bindSingleStores();
  }

  bindSingleStores(): void {
    this.subscription.push(
      this.storeService.getStores().subscribe(data => {
            if (data.length) {
              data.forEach(element => {
                element.MobileNumber = element?.ContactModel?.MobileNumber;
                element.Address = element?.LocationModel?.Address1;
              });
            }

            this.dataSourceSingleStore = new MatTableDataSource<StoresModel>(data);
            this.dataSourceSingleStore.paginator = this.paginator;
            this.dataSourceSingleStore.sort = this.sort;
            this.dataSourceSingleStore.filterPredicate =
                (data: any, filtersJson: string) => {
                    const matchFilter: any = [];
                    const filters = JSON.parse(filtersJson);

                    filters.forEach((filter: any) => {
                      const val = data[filter.id] === null ? '' : data[filter.id];
                      matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
                    });
                      return matchFilter.every(Boolean);
                  };
          }, errors => {
            this.utilitiesService.showHttpError(errors);
          }));
  }


  applyFilter(columnName: string, filter: any) {
    const tableFilters = [];
    tableFilters.push({
      id: columnName,
      value: filter.value
    });

    this.dataSourceSingleStore.filter = JSON.stringify(tableFilters);
    if (this.dataSourceSingleStore.paginator) {
      this.dataSourceSingleStore.paginator.firstPage();
    }
  }

}
