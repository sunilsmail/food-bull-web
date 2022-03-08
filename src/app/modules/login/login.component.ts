import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { UserCredentialsModel, TokenHolder } from 'src/app/shared/app-interfaces';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { StorageClientService } from 'src/app/services/storage-client.service';
import { Subscription } from 'rxjs';
import { WebConfiguration } from 'src/app/helpers/web-configuration';

@Component({
  selector: 'foodbull-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  public isSubmitted = false;
  hide = true;
  fg = {} as FormGroup;
  cred = {} as UserCredentialsModel;
  constructor(
    private titleService: Title,
    private router: Router,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private alertService: AlertMessageService,
    private utilitiesService: UtilitiesService,
    private storage: StorageClientService
    ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Login | FoodBull');

    this.cred = {} as UserCredentialsModel;
    this.cred.RememberMe = true;

    this.fg = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(WebConfiguration.RgxPassword)]),
      rememberMe: new FormControl()
    });

    const ckUserName = this.storage.get(`${WebConfiguration.SID}EMAIL`);
    const ckPassword =  this.storage.get(`${WebConfiguration.SID}PASSWORD`);
    if (!this.utilitiesService.checkNull(ckUserName) && !this.utilitiesService.checkNull(ckPassword)) {
      this.cred.EmailAddress = ckUserName;
      this.cred.Password = atob(ckPassword);
      this.cred.RememberMe = true;
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

  authenticate(formGroup: FormGroup) {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    }
    this.formAccessability(formGroup, false);

    var obj = Object.assign({}, this.cred);

    this.subscription.push(
      this.authService
          .authenticate(obj)
          .subscribe((result: TokenHolder) => {
            this.formAccessability(formGroup, true);
            this.router.navigate(['account/dashboard']);
          }, errors => {
            this.formAccessability(formGroup, true);
            this.utilitiesService.showHttpError(errors, formGroup);
          }));
  }

  ngOnDestroy() {
    this.subscription?.forEach(subscription => subscription.unsubscribe());
  }
}
