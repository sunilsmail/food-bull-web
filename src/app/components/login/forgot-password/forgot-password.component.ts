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
  selector: 'foodbull-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  public isSubmitted = false;
  hide = true;
  fg = {} as FormGroup;
  cred = {} as UserCredentialsModel;
  isEmailSent: boolean = false;

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
    this.titleService.setTitle('Forgot Password | FoodBull');

    this.cred = {} as UserCredentialsModel;

    this.fg = this.formBuilder.group({
      EmailCtrl: new FormControl('', [Validators.required, Validators.email]),
    });
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

    this.subscription.push(
      this.authService
          .forgotPasswordLink(this.cred.EmailAddress)
          .subscribe((result: boolean) => {
            this.formAccessability(formGroup, true);
            this.isEmailSent = true;
            this.alertService.SnackBarWithActions('Reset password link sent to email...', 'Close');
          }, errors => {
            this.formAccessability(formGroup, true);
            this.utilitiesService.showHttpError(errors, formGroup);
          }));
  }

  ngOnDestroy() {
    this.subscription?.forEach(subscription => subscription.unsubscribe());
  }
}
