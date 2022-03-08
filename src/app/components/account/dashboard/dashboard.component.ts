import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { WebConfiguration } from 'src/app/helpers/web-configuration';
import { CommonService } from 'src/app/services/common.service';
import { DashboardCountModel } from 'src/app/shared/app-interfaces';

@Component({
  selector: 'foodbull-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];
  pageTitle = '' as string;
  dashboardCountModel = {} as DashboardCountModel;

  constructor(
    private titleService: Title,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`Dashboard | ${WebConfiguration.AppName}`);
    this.pageTitle = 'Dashboard';

    this.loadHeaderCardStatistics();
  }

  loadHeaderCardStatistics(): void {
    this.subscription.push(this.commonService.getDashboardCount().subscribe(data => this.dashboardCountModel = data));
  }

  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}
