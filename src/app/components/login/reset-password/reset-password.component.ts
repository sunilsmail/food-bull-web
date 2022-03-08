import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { ForgotPasswordModel } from 'src/app/shared/app-interfaces';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { StorageClientService } from 'src/app/services/storage-client.service';
import { Subscription } from 'rxjs';
import { WebConfiguration } from 'src/app/helpers/web-configuration';

@Component({
  selector: 'foodbull-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  public isSubmitted = false;
  hide = true;
  hide1 = true;
  fg = {} as FormGroup;
  forgotPasswordModel = {} as ForgotPasswordModel;
  private sub: any;

  constructor(
    private titleService: Title,
    private router: Router,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: AlertMessageService,
    private utilitiesService: UtilitiesService,
    private storage: StorageClientService
    ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Reset Password | TMEIC');

    this.forgotPasswordModel = {} as ForgotPasswordModel;
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.forgotPasswordModel.Email = params['email'];
      this.forgotPasswordModel.Code = params['code'];
    });

    this.fg = this.formBuilder.group({
      NewPasswordCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(WebConfiguration.RgxPassword)]),
      ConfirmNewPasswordCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(WebConfiguration.RgxPassword)])
      }, { validators: this.passwordMatchValidator('NewPasswordCtrl', 'ConfirmNewPasswordCtrl')
    });
  }

  passwordMatchValidator(password: string, confirmPassword: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[password];
      const confirmPasswordInput = group.controls[confirmPassword];
      if (passwordInput.value !== confirmPasswordInput.value) {
        return confirmPasswordInput.setErrors({ notEquivalent: true });
      } else {
        return confirmPasswordInput.setErrors(null);
      }
    };
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

  submit(formGroup: FormGroup) {
    if (formGroup.invalid) {
      this.alertService.SnackBarWithActions('Required fields are empty', 'Close');
      return;
    }

    if (this.utilitiesService.checkNull(this.forgotPasswordModel.Email) || this.utilitiesService.checkNull(this.forgotPasswordModel.Code)) {
      this.alertService.SnackBarWithActions('Invalid email', 'Close');
      return;
    }

    this.formAccessability(formGroup, false);
    console.log(JSON.stringify(this.forgotPasswordModel));

    this.subscription.push(
      this.authService
          .forgotPassword(this.forgotPasswordModel)
          .subscribe((result: boolean) => {
            this.formAccessability(formGroup, true);
            this.alertService.SnackBarWithActions('Password reset updated successfully! Please login...', 'Close');
            this.router.navigate(['login']);
          }, errors => {
            this.formAccessability(formGroup, true);
            this.utilitiesService.showHttpError(errors, formGroup);
          }));
  }

  ngOnDestroy() {
    this.subscription?.forEach(subscription => subscription.unsubscribe());
  }
}
