import { ContactModel, ImageFileInfo, LocationModel, StoresModel } from "../shared/app-interfaces";

export interface StoreGroupModel {
  Id: number;
  Name: string;
  AccountNo: string;
  LocationModel: LocationModel;
  Logo: ImageFileInfo;
  ContactModel: ContactModel;
  Contacts: ContactModel[];
  Stores: StoresModel[];
  IsStores: boolean;

  detailRow: boolean;
}
