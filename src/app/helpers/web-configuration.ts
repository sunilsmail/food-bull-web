export const WebConfiguration = {
  ApiUrl: 'https://foodbull.azurewebsites.net/api',
  AppName: 'Foodbull',
  RgxOnlyNumeric: '^[0-9]*$',
  RgxTenDigits: '/^[1-9]\d{9}$/',
  RgxDecimalRound2: '^[0-9]+(\.[0-9]{1,2})?$',
  RgxMobileNumber: '[0-9]{10}',
  RgxPincode: '^[A-Za-z0-9]{5,10}$',
  RgxPassword: "(?=.*[A-Z])(?=.*\\d)(?=.*[¡!@#$%*¿?\\-_.\\(\\)])[A-Za-z\\d¡!@#$%*¿?\\-\\(\\)&]{6,20}",
  RgxUKPhoneNumber: /^(([+]44)|(0)) ?\d{2} ?\d{4} ?\d{4}$/,
  RgxUKPostalCode: /^(([A-Z]{1,2}[0-9]{1,2})|([A-Z]{1,2}[0-9][A-Z]))\s?([0-9][A-Z]{2})$/,
  SID: 'FOODBULL_ADMIN_',
  UploadFileSize: '500000',
};

export const TokenConfiguration = {
  AccessToken: '',
  RefreshToken: '',
  RefreshInitiator: false
};
