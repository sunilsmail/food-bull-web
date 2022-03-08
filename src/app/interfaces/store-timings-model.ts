import { DayOfWeek } from "../shared/app-enums";

export interface StoreTimingsModel {
  Id: number;
  DayOfWeek: DayOfWeek;
  OpenHrs: Date;
  CloseHrs: Date;
  IsAllDayOpen: boolean;
  IsNextDay: boolean;
  StoreId: number;
}
