import { CityModel, CountryModel, StateModel } from "../shared/app-interfaces";

export interface LocationModel {
  Id: string;
  Address1: string;
  Address2: string;
  LandMark: string;
  City: CityModel;
  State: StateModel;
  Country: CountryModel;
  ZipCode: string;
  DoorNo: string;
}
