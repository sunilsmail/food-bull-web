import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { WebConfiguration } from 'src/app/helpers/web-configuration';
import { ImageFileInfo } from 'src/app/interfaces/image-file-info';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';

@Component({
  selector: 'foodbull-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() isRequired = false;
  @Input() isMultiple = false;
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() images?: ImageFileInfo[] = [] as ImageFileInfo[];
  @Input() image?: ImageFileInfo = {} as ImageFileInfo;

  @Output() onSelectionChange = new EventEmitter();
  @Output() delete: EventEmitter<ImageFileInfo> = new EventEmitter<ImageFileInfo>();

  fileSize: number = 0;
  selectedFiles: ImageFileInfo[] = [];
  fg = {} as FormGroup;
  public isSubmitted = false;

  // clearButton: any;

  constructor(
    private utilities: UtilitiesService,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private alertMessage: AlertMessageService
  ) {

    this.fg = this.formBuilder.group({
      FileCtrl: new FormControl('')
    });
    //, { updateOn: 'blur' }
   }

  ngOnInit(): void {
    this.fileSize = Number(WebConfiguration.UploadFileSize);
  }

  ngAfterViewInit() {
    // if (this.isRequired) {
    //   this.fg.controls['FileCtrl'].setValidators([Validators.required]);
    // }
    // this.clearButton = this.elementRef.nativeElement.querySelector('#clearButton');
  }

  getUploaderImage(item: ImageFileInfo): any {
    if (this.utilities.checkNull(item))
      return;
    return this.utilities.checkNullAndLength(item.base64) ? item.ImageUrl : item.base64;
  }

  ngOnChanges() {
    if (!this.utilities.checkNullAndLength(this.images) && Object.prototype.toString.call(this.images) == '[object Array]') {

      this.selectedFiles = [] as ImageFileInfo[];
      this.images?.forEach(image => {
        this.selectedFiles.push(image);
      });
      this.onSelectionChange.emit(this.selectedFiles);
    } else if (Object.prototype.toString.call(this.image) === '[object Object]') {
      this.selectedFiles = [] as ImageFileInfo[];
      if (this.image?.IMGID) {
        this.selectedFiles?.push(this.image as ImageFileInfo);
        this.onSelectionChange.emit(this.selectedFiles);
      }
    } else {
      this.onSelectionChange.emit(this.selectedFiles);
    }
  }

  async fileChangeEvent(event: any) {
    if (event.target.files.length === 0) {
      return;
    }

    let images: ImageFileInfo[];
    images = await this.getImgElements(event.target.files);
    images.forEach(image => {
      if (image) {
        this.selectedFiles.push(image);
      }
    });

    this.onSelectionChange.emit(this.selectedFiles);
  }

  getImgElements(files: File[]): Promise<any> {
    let i = 1;
    return Promise.all(
      Array.from(files).map(async (file: File) => {
        const index = i++;
        // return await this.getImgElement(file, index);
        const promise = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          const mimeType = file.type;
          if (!(mimeType.match(/image\/jpeg/) || (mimeType.match(/image\/png/)))) {
                this.alertMessage.SnackBarWithActions('Caution! Only images of type JPEG/PNG are supported', 'Close');
                console.log('Images of type JPEG/PNG are supported');
          } else {
            reader.readAsDataURL(file);
            reader.onload = (_event) => {
              if (file.size <= this.fileSize) {
                const image = {} as ImageFileInfo;
                image.base64 = reader?.result?.toString();
                image.ContentType = file.type;
                image.Name = file.name;
                image.Id = index;
                image.Size = file.size;
                image.file = file;

                resolve(image);
              } else {
                this.alertMessage.SnackBarWithActions('Image is too big. Please upload image of size less than ' + (this.fileSize / 1000) + 'kb', 'Close');
                resolve(false);
              }
            };
          }
        });
        const response: any = await promise;
        return Promise.resolve(response === false ? false : response);
      })
    );
  }

  deleteImage(image: ImageFileInfo, index: number = -1): void {
    if (!this.utilities.checkNull(image)) {
      if (!image.IMGID || image.IMGID.length == 0) {
        this.selectedFiles.splice(index, 1);
        this.onSelectionChange.emit(this.selectedFiles);
      } else {
        this.delete.emit(image);
      }
    }
  }
}
