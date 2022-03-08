export interface UserInformationModel {
  Id: number;
  Address: string;
  ReferredBy: string;
  ShiftStartTime?: Date;
  ShiftEndTime?: Date;

  ImageId: string;
  Image: any;
}
