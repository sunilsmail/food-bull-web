import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { StoresModel, ContactModel } from 'src/app/shared/app-interfaces';
import { StoreService } from 'src/app/services/store.service';
import { WebConfiguration } from 'src/app/helpers/web-configuration';

@Component({
  selector: 'app-add-contact-person',
  templateUrl: './add-contact-person.component.html',
  styleUrls: ['./add-contact-person.component.scss']
})
export class AddContactPersonComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  contact = {} as ContactModel;
  store = {} as StoresModel;
  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<AddContactPersonComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private storeService: StoreService,
    private alertService: AlertMessageService,
    private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder
  ) {
    this.contact = {} as ContactModel;

    this.fg = this.formBuilder.group({
      NameCtrl: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      EmailCtrl: new FormControl('', [Validators.email]),
      MobileNumberCtrl: new FormControl('', [Validators.required, Validators.pattern(WebConfiguration.RgxMobileNumber)]),
      RoleCtrl: new FormControl(),
      IsMainCtrl: new FormControl(),
    });
  }

  ngOnInit() {
    if (!this.utilitiesService.checkNull(this.parameter)
        && !this.utilitiesService.checkNull(this.parameter.regItem)
        && !this.utilitiesService.checkNull(this.parameter.regItem.store)) {

      this.store = JSON.parse(JSON.stringify(this.parameter.regItem.store));
      this.contact.IsStore =  this.parameter.regItem.isStore;

      if (!this.utilitiesService.checkNull(this.parameter.regItem.item)) {
        this.contact = JSON.parse(JSON.stringify(this.parameter.regItem.item));
        this.title = "EDIT CONTACT PERSON";
        this.isEdit = true;
      } else {
        this.title = 'ADD CONTACT PERSON';
        this.isEdit = false;
      }
    }
  }

  submit(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

      this.contact.IsMain = false;
      this.formAccessability(formGroup, false);

      console.log(JSON.stringify(this.contact));
      this.subscription.push(
        this.storeService
            .createContact(this.store.Id, JSON.stringify(this.contact))
            .subscribe((result: boolean) => {
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

      this.contact.IsMain = this.contact.IsMain ? true : false;
      console.log(JSON.stringify(this.contact));

      this.subscription.push(
        this.storeService
            .updateContact(this.contact.Id, JSON.stringify(this.contact))
            .subscribe((result: boolean) => {
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


