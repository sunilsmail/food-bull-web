import { TimingsModel, MenuModel, StoresModel, ServicesModel, AddOnModel } from "../shared/app-interfaces";

export interface CategoryModel {
  Id: number;
  Name: string;
  Description: string;
  IsDefault: boolean;
  MenuId: number;
  IsActive: boolean;
  StoreId: number;
  IsHideCategory: boolean;
  MenuModel: MenuModel;
  IsAvailableHrs: boolean;
  ServiceIds: number[];
  AddOnIds: number[];
  Timings: TimingsModel[];
  Services: ServicesModel[];
  AddOnModels: AddOnModel[];

  LstAddOns?: AddOnModel[];
  Stores: StoresModel[];
}
