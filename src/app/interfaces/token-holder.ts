export interface TokenHolder {
  Id?: number;
  Name: string;
  UserName: string;
  Email?: string;
  IsNewUser?: boolean;
  RoleName: string;
  StoreId: number;
  AccessToken: string;
  RefreshToken: string;
}
