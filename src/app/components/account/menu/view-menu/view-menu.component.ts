import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { MenuModel, ServicesModel } from 'src/app/shared/app-interfaces';
import { Subscription } from 'rxjs/internal/Subscription';
import { MenuService } from 'src/app/services/menu.service';
import { DayOfWeek } from 'src/app/shared/app-enums';

@Component({
  selector: 'foodbull-view-menu',
  templateUrl: './view-menu.component.html',
  styleUrls: ['./view-menu.component.scss']
})
export class ViewMenuComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];
  lstServices = [] as ServicesModel[];
  lstSelectedServices = [] as ServicesModel[];
  menu = {} as MenuModel;
  weekDays = DayOfWeek;

  constructor(
    public dialogRef: MatDialogRef<ViewMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private utilitiesService: UtilitiesService,
    private menuService: MenuService
    ) { }

  ngOnInit(): void {
    if (!this.utilitiesService.checkNull(this.parameter) && !this.utilitiesService.checkNull(this.parameter.regItem)) {
      let obj = JSON.parse(JSON.stringify(this.parameter.regItem));
      this.subscription.push(this.menuService.getMenu(obj.Id).subscribe((response: MenuModel) => this.menu = response, errors => this.utilitiesService.showHttpError(errors)));
    }
  }

  dismiss(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}
