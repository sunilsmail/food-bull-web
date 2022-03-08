import { StoresModel, UserModel } from "../shared/app-interfaces";

export interface StoreUserMappingModel {
  Id: number;
  User: UserModel;
  Store: StoresModel;
}
