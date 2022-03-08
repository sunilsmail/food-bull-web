import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { ItemModel } from 'src/app/shared/app-interfaces';
import { Subscription } from 'rxjs';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'foodbull-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss']
})
export class ViewItemComponent implements OnInit {
  private subscription: Subscription[] = [];

  item = {} as ItemModel;
  constructor(
    public dialogRef: MatDialogRef<ViewItemComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private utilitiesService: UtilitiesService,
    private itemService: ItemService
    ) { }

  ngOnInit(): void {
    if (!this.utilitiesService.checkNull(this.parameter) && !this.utilitiesService.checkNull(this.parameter.itemId)) {
      this.subscription.push(
        this.itemService.getItem(this.parameter.itemId)
            .subscribe((result: ItemModel) => {
              this.item = result;
            }, errors => { this.utilitiesService.showHttpError(errors); }));
    }
  }

  dismiss(): void {
    this.dialogRef.close();
  }

}
