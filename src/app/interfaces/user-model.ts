import { RoleModel, StoreGroupModel, StoresModel, UserInformationModel } from "../shared/app-interfaces";

export interface UserModel {
  Id: number;
  FirstName: string;
  LastName: string;
  MobileNumber: string;
  UserName: string;
  Email: string;
  Password: string;
  ForgetPasswordCode: string;
  Role: RoleModel;
  StoreIds: number[];
  Stores: StoresModel[];

  StoreGroup: StoreGroupModel;
  RoleName?: string;
}
