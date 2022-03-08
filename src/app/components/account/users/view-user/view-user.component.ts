import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { UserModel } from 'src/app/shared/app-interfaces';

@Component({
  selector: 'foodbull-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  user = {} as UserModel;
  constructor(
    public dialogRef: MatDialogRef<ViewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private utilitiesService: UtilitiesService
    ) { }

  ngOnInit(): void {
    if (!this.utilitiesService.checkNull(this.parameter) && !this.utilitiesService.checkNull(this.parameter.regItem)) {
      this.user = JSON.parse(JSON.stringify(this.parameter.regItem));
    }
  }

  dismiss(): void {
    this.dialogRef.close();
  }

}

