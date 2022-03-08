import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserModel, RoleModel, StoresModel } from 'src/app/shared/app-interfaces';
import { StoreService } from 'src/app/services/store.service';
import { WebConfiguration } from 'src/app/helpers/web-configuration';
import { UserService } from 'src/app/services/user.service';
import { RolesService } from 'src/app/services/role.service';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'foodbull-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  user = {} as UserModel;
  lstRoles = [] as RoleModel[];
  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;
  hide = false;

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredStores: Observable<StoresModel[]>;
  storeCtrl = new FormControl();
  lstStores = [] as StoresModel[];
  selectedStores = [] as StoresModel[];
  @ViewChild('storeInput') storeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private storeService: StoreService,
    private rolesService: RolesService,
    private userService: UserService,
    private alertService: AlertMessageService,
    private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder
  ) {
    this.user = {} as UserModel;
    this.bindRoles();
    this.bindStores();

    this.fg = this.formBuilder.group({
      FirstNameCtrl: new FormControl('', [Validators.required, Validators.maxLength(16)]),
      LastNameCtrl: new FormControl('', [Validators.maxLength(16)]),
      UserNameCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      EmailCtrl: new FormControl('', [Validators.required, Validators.email]),
      RoleCtrl: new FormControl('', [Validators.required]),
      MobileNumberCtrl: new FormControl('', [Validators.required, Validators.pattern(WebConfiguration.RgxMobileNumber)]),
      StoreCtrl: new FormControl(),
      PasswordCtrl: new FormControl('', [Validators.required, Validators.pattern(WebConfiguration.RgxPassword)])
    });

    this.filteredStores = this.fg.controls['StoreCtrl'].valueChanges.pipe(startWith(null),
      map((store: StoresModel | null) => store ? this._filter(store) : this.lstStores.slice()));

  }

  ngOnInit() {

    if (!this.utilitiesService.checkNull(this.parameter)
        && !this.utilitiesService.checkNull(this.parameter.regItem)
        && !this.utilitiesService.checkNull(this.parameter.regItem.userId)) {

          this.subscription.push(
            this.userService
                .getUserById(this.parameter.regItem.userId)
                .subscribe(data => {
                  this.user = data;
                  if (!this.utilitiesService.checkNullAndLength(this.user.Stores)) {
                    this.selectedStores = JSON.parse(JSON.stringify(this.user.Stores));
                  }
                }, errors => {
                  this.utilitiesService.showHttpError(errors);
                }));

          this.title = "EDIT STORE USER";
          this.isEdit = true;
          this.fg.controls['UserNameCtrl'].setValidators(null);
          this.fg.controls['PasswordCtrl'].setValidators(null);
          this.fg.updateValueAndValidity();

        } else {
          this.title = 'ADD NEW STORE USER';
          this.isEdit = false;
          if (!this.utilitiesService.checkNull(this.parameter.regItem.store)) {
            this.selectedStores.push(JSON.parse(JSON.stringify(this.parameter.regItem.store)));
          }
        }
  }

  bindRoles() {
    this.subscription.push(
      this.rolesService
          .getRoles()
          .subscribe(data => {
            this.lstRoles = data;
          }, errors => {
            this.utilitiesService.showHttpError(errors);
          }));
  }

  bindStores() {
    this.subscription.push(this.storeService.getStores().subscribe(
      data => {
        this.lstStores = data;
        console.log(data);
      },
      errors => this.utilitiesService.showHttpError(errors)));
  }

  //#region Stores Multiselect

  getOptionText(option: any) {
    return !(typeof option === 'undefined' || option === null || option.length === 0) ? option.Name : '';
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let store = <StoresModel | any>value;

    // Add our store
    if ((value || '').trim()) {
      this.selectedStores.push(store);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.storeCtrl.setValue(null);
  }

  remove(store: StoresModel, index: number): void {

    this.selectedStores.splice(index, 1);

    // const index = this.selectedStores.indexOf(store);

    // if (index >= 0) {
    //   this.selectedStores.splice(index, 1);
    // }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let store = <StoresModel | any>event.option.value;

    this.selectedStores.push(store);
    this.storeInput.nativeElement.value = '';
    this.storeCtrl.setValue(null);
  }

  private _filter(query: any): StoresModel[] {
    let regExpResult: any;
    let p: any = Array.from(query).reduce((a, v, i) => `${a}[^${query.substr(i)}]*?${v}`, '');
    regExpResult = RegExp(p);
    return this.lstStores.filter(v => v.Name.toLowerCase().match(regExpResult));
  }
  //#endregion

  objectComparisonFunction = (option: any, value: any): boolean => {
    return option.Name == value.Name;
  }

  generatePassword(): void {
    this.user.Password = "Password@123";
  }

  submit(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

      this.formAccessability(formGroup, false);

      this.user.Stores = [];
      if (!this.utilitiesService.checkNullAndLength(this.selectedStores)) {
        let stores: StoresModel[] = JSON.parse(JSON.stringify(this.selectedStores));
        this.user.StoreIds =  stores.map((_) => _.Id);
      }
      console.log(JSON.stringify(this.user));
      this.subscription.push(this.userService.createUser(this.user).subscribe(
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

      this.user.Stores = [];
      if (!this.utilitiesService.checkNullAndLength(this.selectedStores)) {
        let stores: StoresModel[] = JSON.parse(JSON.stringify(this.selectedStores));
        this.user.StoreIds =  stores.map((_) => _.Id);
      }
      console.log(JSON.stringify(this.user));

      this.subscription.push(
        this.userService
            .updateUser(this.user.Id, JSON.stringify(this.user))
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



