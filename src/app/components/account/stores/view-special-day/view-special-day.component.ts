import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { StoreSpecialDayModel } from 'src/app/shared/app-interfaces';

@Component({
  selector: 'foodbull-view-special-day',
  templateUrl: './view-special-day.component.html',
  styleUrls: ['./view-special-day.component.scss']
})
export class ViewSpecialDayComponent implements OnInit {

  specialDay = {} as StoreSpecialDayModel;
  constructor(
    public dialogRef: MatDialogRef<ViewSpecialDayComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private utilitiesService: UtilitiesService
    ) { }

  ngOnInit(): void {
    if (!this.utilitiesService.checkNull(this.parameter) && !this.utilitiesService.checkNull(this.parameter.regItem)) {
      this.specialDay = JSON.parse(JSON.stringify(this.parameter.regItem));
    }
  }

  dismiss(): void {
    this.dialogRef.close();
  }

}
