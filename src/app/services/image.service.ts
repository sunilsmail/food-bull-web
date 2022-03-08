import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import {
  WebConfiguration,
} from '../helpers/web-configuration';
import { ImageFileInfo } from '../interfaces/image-file-info';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(
    private httpService: HttpClient
  ) {}

  // uploadImage(file: any): Observable<string> {
  //   return new Observable<string>
  //   (observer => {
  //     this.httpService
  //       .post(`${WebConfiguration.ApiUrl}/Image/UploadImage`, file)
  //       .subscribe(
  //         (result) => {
  //           var data = result as string;
  //           observer.next(data);
  //         },
  //         error => {
  //           observer.error(error);
  //         }
  //       );
  //   });
  // }

  dataURItoBlob(dataURI: any) {
    const binary = atob(dataURI.split(',')[1]);

    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], {
      type: 'image/png'
    });
  }

  uploadImage(image: any): Observable<ImageFileInfo> {
    let formData = new FormData();
    let imageInfo = {} as ImageFileInfo;
    imageInfo.Name = image.Name;
    imageInfo.ContentType = image.ContentType;
    imageInfo.ContentExtension = image.ContentType;
    formData.append('file', image.file, image.file.name);

    let promise = new Observable((subscriber) => {
      this.httpService.post(`${WebConfiguration.ApiUrl}/Image/UploadImage`, formData, {responseType: 'text'})
        .subscribe((res: any) => {
          imageInfo.IMGID = res;
          subscriber.next(imageInfo);
          subscriber.complete();
        })
      })
    return promise as Observable<ImageFileInfo>;
  }


  showImage(imageId: string): Observable<any> {
    return new Observable<any>
    (observer => {
      this.httpService
        .get(`${WebConfiguration.ApiUrl}/Image/ShowImage/${imageId}`)
        .subscribe(
          (result) => {
            var data = result as any;
            observer.next(data);
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  deleteImage(imageId: string): Observable<boolean> {
    return new Observable<boolean>
    (observer => {
      this.httpService
        .delete(`${WebConfiguration.ApiUrl}/Image/DeleteImage/${imageId}`)
        .subscribe(
          (result) => {
            var data = result as boolean;
            observer.next(data);
          },
          error => {
            observer.error(error);
          }
        );
    });
  }



}
