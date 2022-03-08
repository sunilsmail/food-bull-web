export interface ForgotPasswordModel {
  Email: string;
  Code: string;
  NewPassword: string;
  ConfirmNewPassword?: string;
}
