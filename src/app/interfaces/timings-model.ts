import { DayOfWeek } from "../shared/app-enums";

export interface TimingsModel {
  Id: number;
  DayOfWeek: DayOfWeek;
  OpenHrs: Date;
  CloseHrs: Date;
  IsAllDayOpen: boolean;
  IsNextDay: boolean;

  CategoryId?: number;
  MenuId?: number;
  StoreId?: number;
}
