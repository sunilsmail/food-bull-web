import { TimingsModel } from "../shared/app-interfaces";

export interface StoreInformationModel {
  Id: number;
  Address: string;
  ZipCode: string;
  Timings: TimingsModel[];
}
