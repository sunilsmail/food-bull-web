export interface SubHierarchyModel {
  SNo: number;
  Id: number;
  Name: string;
  IsSelect: boolean;
  Type: string;
  RecordType: string;
  lstSubItems: SubHierarchyModel[];

  level: number;
  expandable: boolean;
}
