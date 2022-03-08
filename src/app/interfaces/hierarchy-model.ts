import { Categories, MenuServices, SubHierarchyModel } from "../shared/app-interfaces";

export interface HierarchyModel {
  Id: number;
  Name: string;
  IsSelect: boolean;
  LstSubHierarchyModel: SubHierarchyModel[];
}
