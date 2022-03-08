import { RoleModel } from "../shared/app-interfaces";

export interface UserAuthInformation {
  Id: number;
  Name: string;
  UserName: string;
  Email: string;
  Roles: RoleModel;
}
