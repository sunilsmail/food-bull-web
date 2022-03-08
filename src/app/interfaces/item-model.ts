import { AddOnModel, AllergenTagsModel, ImageFileInfo, StoresModel, UOMModel } from "../shared/app-interfaces";

export interface ItemModel {
    Id: number;
    Name: string;
    Description: string;
    Price: number;
    SubTitle: string;

    StoreId: number;
    IsActive: boolean;
    IsDefault: boolean;
    MenuId: number;
    CategoryId: number;
    OrderNo: number;
    IsSingle: boolean;
    ItemType: string;
    DisplayName: string;
    PrintName: string;
    AddOnIds: number[];
    AllergienTagIds: number[];


    Images: ImageFileInfo[];
    UOMModels: UOMModel[];
    AllergensTagsModels: AllergenTagsModel[];
    AddOnModels: AddOnModel[];

    Stores: StoresModel[];
    EditTimings?: boolean;
    LstAddOns?: AddOnModel[];
}
