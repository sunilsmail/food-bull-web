import { CategoryAddOns, CategoryItems, CategoryServices } from "../shared/app-interfaces";

export interface Categories {
  Id: number;
  CategoryName: string;
  IsSelect: boolean;
  Services: CategoryServices[];
  categoryAddOns: CategoryAddOns[];
  categoryItems: CategoryItems[];
}
