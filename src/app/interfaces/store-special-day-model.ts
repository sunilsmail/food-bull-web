export interface StoreSpecialDayModel {
  Id: number;
  FromDate: Date;
  ToDate: Date;
  Description: string;
  OpenHrs: Date;
  CloseHrs: Date;
  IsStatus: boolean;
  IsAllDayOpen: boolean;
  StoreId: number;
}
