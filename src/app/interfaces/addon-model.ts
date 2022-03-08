import { AddOnItemModel, UOMModel } from "../shared/app-interfaces";

export interface AddOnModel {
  Id: number;
  Sources: string;
  IsMakeRequired: boolean;
  IsSelectMultiple: boolean;
  IsEnableOptionQuantiy: boolean;
  MinimumOption: number;
  MaximumOption: number;
  IsActive: boolean;
  DisplayName: string;
  StoreId: number;
  AddOnItemModels: AddOnItemModel[];
  OrderNo: number;
}
