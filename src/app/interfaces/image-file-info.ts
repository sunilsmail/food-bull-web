export interface ImageFileInfo {
  Id: number;
  IMGID: string;
  Name: string;
  ContentType: string;
  ContentExtension: string;
  ImageFolder: string;
  ImageUrl: string;
  Content: any;
  LastUpdateTime: Date;

  base64?: string | ArrayBuffer;
  file: File;
  Size?: number;

}
