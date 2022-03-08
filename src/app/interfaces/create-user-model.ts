import { RoleModel, UserInformationModel } from "../shared/app-interfaces";

export interface CreateUserModel {
  Id: number;
  FirstName: string;
  LastName: string;
  MobileNumber: string;
  UserName: string;
  Email: string;
  Password: string;

  UserInformation: UserInformationModel;

  Role: RoleModel;
}
