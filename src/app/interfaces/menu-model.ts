import { ServicesModel, StoresModel, TimingsModel } from "../shared/app-interfaces";

export interface MenuModel {
  Id: number;
  Name: string;
  Description: string;
  IsDefault: boolean;
  IsHideMenu: boolean;
  StoreId: number;
  Stores: StoresModel;
  IsAvailableHrs: boolean;

  // StoreIds: number[];
  ServiceIds: number[];
  Timings: TimingsModel[];

  Services: ServicesModel[];
}
