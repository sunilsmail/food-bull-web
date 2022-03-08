import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { ContactModel } from 'src/app/shared/app-interfaces';

@Component({
  selector: 'foodbull-view-contact-person',
  templateUrl: './view-contact-person.component.html',
  styleUrls: ['./view-contact-person.component.scss']
})
export class ViewContactPersonComponent implements OnInit {

  contact = {} as ContactModel;
  constructor(
    public dialogRef: MatDialogRef<ViewContactPersonComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private utilitiesService: UtilitiesService
    ) { }

  ngOnInit(): void {
    if (!this.utilitiesService.checkNull(this.parameter) && !this.utilitiesService.checkNull(this.parameter.regItem)) {
      this.contact = JSON.parse(JSON.stringify(this.parameter.regItem));
    }
  }

  dismiss(): void {
    this.dialogRef.close();
  }

}
