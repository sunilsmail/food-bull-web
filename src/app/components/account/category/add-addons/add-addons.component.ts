import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { WebConfiguration } from 'src/app/helpers/web-configuration';
import { AddOnItemModel, AddOnModel, ImageFileInfo } from 'src/app/shared/app-interfaces';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddOnService } from 'src/app/services/add-on.service';

@Component({
  selector: 'foodbull-add-addons',
  templateUrl: './add-addons.component.html',
  styleUrls: ['./add-addons.component.scss']
})
export class AddAddonsComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  AddOnItemModelsArray = {} as FormArray;
  item = {} as AddOnModel;
  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;
  lstImages = [] as ImageFileInfo[];
  httpImageRequests = [] as Observable<ImageFileInfo>[];
  radioValue:any = '';

  constructor(
    public dialogRef: MatDialogRef<AddAddonsComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private alertService: AlertMessageService,
    private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder,
    private addOnService: AddOnService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.title = "Create ADDON";
    this.item = {} as any;
    this.AddOnItemModelsArray = {} as FormArray;

    this.fg = this.formBuilder.group({
      SourcesCtrl: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
      DisplayNameCtrl: new FormControl('', [Validators.maxLength(200)]),
      AddOnItemModelsArray: this.formBuilder.array([], { updateOn: 'blur' }),
      IsMakeRequiredCtrl: new FormControl(),
      IsSelectMultipleCtrl: new FormControl(),
      IsEnableOptionQuantiyCtrl: new FormControl(),
      MinimumOptionCtrl: new FormControl(),
      MaximumOptionCtrl: new FormControl()
    });

    this.fg.controls['IsEnableOptionQuantiyCtrl'].valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.item.MinimumOption = 0;
        this.item.MaximumOption = 0;
      }
    });

    if (!this.utilitiesService.checkNull(this.parameter)
        && !this.utilitiesService.checkNull(this.parameter.regItem)
        && !this.utilitiesService.checkNull(this.parameter.regItem.storeId)) {
          this.item.StoreId = this.parameter.regItem.storeId;
        }
  }

  get getAddOnItemModelsGroup(): FormGroup {
    return this.formBuilder.group({
      Id: new FormControl(''),
      Name: new FormControl('', Validators.required),
      Price: new FormControl('', [Validators.required, Validators.pattern(WebConfiguration.RgxDecimalRound2)]),
      IsStock: new FormControl(false),
      IsActive: new FormControl('')
    });
  }

  get getAddOnItemModelsArray() {
    return this.fg.get('AddOnItemModelsArray') as FormArray;
  }

  addNewUOM() {
    let control = <FormArray>this.fg.controls['AddOnItemModelsArray'];
    control.push(this.getAddOnItemModelsGroup);
  }

  deleteUOM(index: number) {
    let control = <FormArray>this.fg.controls['AddOnItemModelsArray'];
    control.removeAt(index);
  }

  getRadioChangeEvent(items: any, uomIndex: number): void {
    if (this.utilitiesService.checkNullAndLength(items)) {
      return;
    }
    items.forEach((item: any, index: number) => {
      Object.keys(item.controls).forEach((key, cindex) => {
        if (key == "IsStock") {
          let status = uomIndex == index ? true : false;
          item.controls[key].setValue(status);
        }
      });
    });
  }

  submit(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else if (this.utilitiesService.checkNull(this.item.StoreId)) {
      this.alertService.SnackBarWithActions('Store is not selected.', 'Close');
      return;
    } else {

      this.item.AddOnItemModels = [] as AddOnItemModel[];

      this.fg.get('AddOnItemModelsArray')?.value.forEach((item: any) => {
        let aItem = {} as AddOnItemModel;
        aItem.Id = 0;
        aItem.IsActive = true;
        aItem.IsStock = item.IsStock ? true : false;
        aItem.Name = item.Name;
        aItem.Price = +item.Price;

        this.item.AddOnItemModels.push(aItem);
      });

      console.log(JSON.stringify(this.item));
      this.formAccessability(formGroup, false);
      this.subscription.push(
        this.addOnService.createAddOn(this.item).subscribe((result: boolean) => {
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
