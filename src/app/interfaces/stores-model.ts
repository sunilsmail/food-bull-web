import { ContactModel, ImageFileInfo, LocationModel, MenuModel, StoreGroupModel, StoreSpecialDayModel, StoreTimingsModel } from "../shared/app-interfaces";

export interface StoresModel {
  Id: number;
  Name: string;
  AccountNo: string;
  IsOnline: boolean;
  Status: number;
  LocationModel: LocationModel;
  Logo: ImageFileInfo;
  ContactModel: ContactModel;
  StoreGroupModel: StoreGroupModel;
  Contacts: ContactModel[];
  TimingsModel: StoreTimingsModel[];
  StoreSpecialDayModel: StoreSpecialDayModel[];
  MenuModels: MenuModel[];

  Address?: string;
  MobileNumber?: string;
}
