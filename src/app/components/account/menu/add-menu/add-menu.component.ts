import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { MenuModel, ServicesModel, StoresModel, TimingsModel } from 'src/app/shared/app-interfaces';
import { StoreService } from 'src/app/services/store.service';
import { MenuService } from 'src/app/services/menu.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, from, concat, scheduled, of } from 'rxjs';
import { concatMap, map, startWith, switchMap, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MasterServicesService } from 'src/app/services/master-service.service';

@Component({
  selector: 'foodbull-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  fg = {} as FormGroup;
  menu = {} as MenuModel;
  title = '' as string;
  isEdit = false as boolean;
  public isSubmitted = false;
  isDefaultStore: boolean = false;

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredStores: Observable<StoresModel[]>;
  storeCtrl = new FormControl();
  lstStores = [] as StoresModel[];
  selectedStores = {} as StoresModel;
  savedTimings: TimingsModel[] = [] as TimingsModel[];

  @ViewChild('storeInput') storeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  servicesFBArray = new FormArray([]);
  lstServices = [] as ServicesModel[];

  constructor(
    public dialogRef: MatDialogRef<AddMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private storeService: StoreService,
    private menuService: MenuService,
    private alertService: AlertMessageService,
    public utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder,
    private masterServicesService: MasterServicesService
  ) {
    this.menu = {} as MenuModel;

    this.fg = this.formBuilder.group({
      NameCtrl: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      StoreCtrl: new FormControl(),
      DescriptionCtrl: new FormControl('', [Validators.maxLength(50)]),
      IsAvailableHrsCtrl: new FormControl(),
      IsHideMenuCtrl: new FormControl(),
      servicesArray: this.servicesFBArray
    });

    this.filteredStores = this.fg.controls['StoreCtrl'].valueChanges.pipe(
      startWith(null),
      map((store: StoresModel | null) => store ? this._filter(store) : this.lstStores.slice()));

    this.fg.controls["IsAvailableHrsCtrl"].valueChanges.subscribe((value: boolean) => {
      if (!value) {
        this.menu.Timings = [] as TimingsModel[];
      }
    });
  }

  ngOnInit() {

    this.bindStores();
    this.bindServices();

    if (!this.utilitiesService.checkNull(this.parameter)
        && !this.utilitiesService.checkNull(this.parameter.regItem)
        && !this.utilitiesService.checkNull(this.parameter.regItem.menuId)) {
          this.subscription.push(
            this.menuService
                .getMenu(this.parameter.regItem.menuId)
                .subscribe(data => {
                  this.menu = data;

                  if (!this.utilitiesService.checkNullAndLength(this.menu.Stores)) {
                    this.selectedStores = JSON.parse(JSON.stringify(this.menu.Stores));
                  }

                  if (this.menu.Services?.length) {
                    this.menu.ServiceIds = this.menu.Services.map((_) => _.Id);
                  }

                }, errors => {
                  this.utilitiesService.showHttpError(errors);
                }));

          this.title = "EDIT MENU";
          this.isEdit = true;

        } else {
          this.title = 'ADD NEW MENU';
          this.isEdit = false;

          if(!this.utilitiesService.checkNull(this.parameter.regItem.store)) {
            this.selectedStores = JSON.parse(JSON.stringify(this.parameter.regItem.store));
            this.isDefaultStore = true;
          }
        }

  }

  bindStores() {
    // let res$ = this.storeService.getStores().pipe(
    //   concatMap(response => { return of(response)}),
    //   tap(stores => {
    //     this.lstStores = stores;
    //     this.masterServicesService.getAllActiveServices().pipe(
    //       concatMap(res => { return of(res)}),
    //       tap(services => {
    //         this.lstServices = services;
    //         if (!this.utilitiesService.checkNullAndLength(this.lstServices)) {
    //           this.lstServices.forEach(service => {
    //             service.IsSelected = false;
    //             this.servicesFBArray.controls.push(new FormControl(service.IsSelected));
    //           });
    //         }
    //       })
    //     )
    //   })
    //   ).subscribe();

    // console.log("obs res: ");
    // console.log(res$.subscribe(observer));

    // const asdf = scheduled(, this.masterServicesService.getAllActiveServices())

    // combineResult$.subscribe(
    //   (response1) => { this.lstServices = response1 as StoresModel[] },
    //   (response2) => {
    //     this.lstServices = response2;
    //     if (!this.utilitiesService.checkNullAndLength(this.lstServices)) {
    //       this.lstServices.forEach(service => {
    //         service.IsSelected = false;
    //         this.servicesFBArray.controls.push(new FormControl(service.IsSelected));
    //       });
    //     }
    //   }
    // )
    this.subscription.push(this.storeService.getStores().subscribe(data => this.lstStores = data, errors => this.utilitiesService.showHttpError(errors)));
  }

  bindServices() {
    this.subscription.push(this.masterServicesService.getAllActiveServices().subscribe(data => {
        this.lstServices = data;
        if (!this.utilitiesService.checkNullAndLength(this.lstServices)) {
          this.lstServices.forEach(service => {
            service.IsSelected = false;
            this.servicesFBArray.controls.push(new FormControl(service.IsSelected));
          });
        }
      }, errors => this.utilitiesService.showHttpError(errors)));
  }

  isServiceSelected(value: any, index: number): boolean {
    if (this.utilitiesService.checkNullAndLength(this.menu.ServiceIds)) {
      return false;
    }
    let service =  this.lstServices[index];
    return this.menu.ServiceIds.includes(service.Id);
  }

  //#region Stores Multiselect

  getOptionText(option: any) {
    return !(typeof option === 'undefined' || option === null || option.length === 0) ? option.Name : '';
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let store = <StoresModel | any>value;

    // Add our fruit
    if ((value || '').trim()) {
      this.selectedStores = store;
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.storeCtrl.setValue(null);
  }

  remove(): void {
    this.selectedStores = {} as StoresModel;
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let store = <StoresModel | any>event.option.value;

    this.selectedStores = store;
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

  saveWTCChanges(timings: TimingsModel[]) {
    if (timings) {
      this.savedTimings = timings.filter(c => c.IsAllDayOpen);
    }
  }

  submit(formGroup: FormGroup): void {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    } else {

      this.menu.StoreId = this.selectedStores.Id;

      this.menu.ServiceIds = [] as number[];
      if (this.lstServices?.length) {
        (this.fg.get('servicesArray') as FormArray).controls.forEach((item: any, index: number) => {
          this.lstServices[index].IsSelected = item.value;
          if (item.value) {
            this.menu.ServiceIds.push(this.lstServices[index].Id);
          }
        });
      }

      this.menu.Timings = this.menu.IsAvailableHrs ? this.savedTimings : [] as TimingsModel[];

      console.log(JSON.stringify(this.menu));

      this.formAccessability(formGroup, false);

      this.subscription.push(this.menuService.createMenu(this.menu).subscribe(
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

      this.menu.StoreId = this.selectedStores ? this.selectedStores.Id : 0;

      this.menu.ServiceIds = [] as number[];
      debugger;

      if (this.lstServices?.length) {
        (this.fg.get('servicesArray') as FormArray).controls.forEach((item: any, index: number) => {
          this.lstServices[index].IsSelected = item.value;
          debugger;
          if (item.value) {
            this.menu.ServiceIds.push(this.lstServices[index].Id);
          }
        });
      }

      this.menu.Timings = this.menu.IsAvailableHrs ? this.savedTimings : [] as TimingsModel[];

      console.log(JSON.stringify(this.menu));

      this.formAccessability(formGroup, false);

      this.subscription.push(
        this.menuService
            .updateMenu(this.menu.Id, this.menu)
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


