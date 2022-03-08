import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderTitleService {
  titleData = new EventEmitter<string>();

  constructor() { }

  setTitle(title: string): void {
    this.titleData.emit(title);
  }

  getTitle(): EventEmitter<string> {
    return this.titleData;
  }

  clearTitle(): void {
    this.titleData = new EventEmitter<string>();
  }

}
