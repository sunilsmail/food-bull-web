import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { AllergenTagsModel } from 'src/app/shared/app-interfaces';
import { AllergenTagsService } from 'src/app/services/allergen-tags.service';

@Component({
  selector: 'foodbull-add-allergens-tags',
  templateUrl: './add-allergens-tags.component.html',
  styleUrls: ['./add-allergens-tags.component.scss']
})
export class AddAllergensTagsComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  allergen = {} as AllergenTagsModel;
  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<AddAllergensTagsComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private alertService: AlertMessageService,
    public utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder,
    private allergenTagsService: AllergenTagsService
  ) {
    this.allergen = {} as AllergenTagsModel;

    this.fg = this.formBuilder.group({
      NameCtrl: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      DescriptionCtrl: new FormControl('', [Validators.maxLength(500)])
    });
  }

  ngOnInit(): void {
    if (!this.utilitiesService.checkNull(this.parameter)
        && !this.utilitiesService.checkNull(this.parameter.regItem)
        && !this.utilitiesService.checkNull(this.parameter.regItem.allergenId)) {

          this.subscription.push(
            this.allergenTagsService.getAllergenTags(this.parameter.regItem.allergenId).subscribe(
              data => this.allergen = data, errors => this.utilitiesService.showHttpError(errors)));

          this.title = "EDIT ALLERGEN & TAG";
          this.isEdit = true;

        } else {

          this.title = 'ADD ALLERGEN & TAG';
          this.isEdit = false;

        }
  }

  submit(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

      console.log(JSON.stringify(this.allergen));

      this.formAccessability(formGroup, false);
      this.subscription.push(this.allergenTagsService.createAllergenTags(this.allergen).subscribe(
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
      console.log(JSON.stringify(this.allergen));

      this.subscription.push(this.allergenTagsService.updateAllergenTags(this.allergen.Id, this.allergen).subscribe((result: boolean) => {
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


