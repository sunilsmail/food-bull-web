import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { ServicesModel } from 'src/app/shared/app-interfaces';
import { MasterServicesService } from 'src/app/services/master-service.service';

@Component({
  selector: 'foodbull-add-master-service',
  templateUrl: './add-master-service.component.html',
  styleUrls: ['./add-master-service.component.scss']
})
export class AddMasterServiceComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  services = {} as ServicesModel;
  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<AddMasterServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private alertService: AlertMessageService,
    public utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder,
    private masterServicesService: MasterServicesService
  ) {
    this.services = {} as ServicesModel;

    this.fg = this.formBuilder.group({
      NameCtrl: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      DescriptionCtrl: new FormControl('', [Validators.maxLength(500)])
    });
  }

  ngOnInit(): void {
    if (!this.utilitiesService.checkNull(this.parameter)
        && !this.utilitiesService.checkNull(this.parameter.regItem)
        && !this.utilitiesService.checkNull(this.parameter.regItem.serviceId)) {

          this.subscription.push(
            this.masterServicesService.getService(this.parameter.regItem.serviceId).subscribe(
              data => this.services = data, errors => this.utilitiesService.showHttpError(errors)));

          this.title = "EDIT SERVICE";
          this.isEdit = true;

        } else {

          this.title = 'ADD SERVICE';
          this.isEdit = false;

        }
  }

  submit(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

      console.log(JSON.stringify(this.services));

      this.formAccessability(formGroup, false);
      this.subscription.push(this.masterServicesService.createService(this.services).subscribe(
          (result: boolean) => {
              if (result) {
                this.alertService.SnackBarWithActions('Saved successfully', 'Close');
                this.formAccessability(formGroup, true);
                this.dialogRef.close('reload');
              }
            }, errors => {
              this.formAccessability(formGroup, true);
              this.utilitiesService.showHttpError(errors);
        }));
      }
  }

  update(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

      this.formAccessability(formGroup, false);
      console.log(JSON.stringify(this.services));

      this.subscription.push(this.masterServicesService.updateService(this.services.Id, this.services).subscribe((result: boolean) => {
              if (result) {
                this.alertService.SnackBarWithActions('Updated successfully', 'Close');
                this.formAccessability(formGroup, true);
                this.dialogRef.close('reload');
              }
            }, errors => {
              this.formAccessability(formGroup, true);
              this.utilitiesService.showHttpError(errors);
        }));
      }
  }

  formAccessability(formGroup: FormGroup, isEnable: boolean) {
    if (isEnable) {
      formGroup.enable();
      this.isSubmitted = false;
    } else {
      formGroup.disable();
      this.isSubmitted = true;
    }
  }

  dismiss(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription?.forEach(sub => sub.unsubscribe());
  }
}


