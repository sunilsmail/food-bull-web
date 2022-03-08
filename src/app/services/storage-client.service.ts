import { Injectable } from '@angular/core';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class StorageClientService {
  constructor(private storage: LocalStorageService) { }

  public set(settingName: any, value: any) {
    return this.storage.store(settingName, value);
  }

  public get(settingName: any) {
    return this.storage.retrieve(settingName);
  }

  public async remove(settingName: any) {
    return await this.storage.clear(settingName);
  }

  public clear() {
    // this.localSt.clear().then(() => {
    //   console.log('all keys cleared');
    // });
  }

}
