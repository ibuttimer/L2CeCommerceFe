import { Injectable } from '@angular/core';

import appConfig from '../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // sessionStorage survives refreshes whereas localStorage survives browser restarts

  constructor() { }

  get storage(): Storage {
    return appConfig.app.storage == 'local'? localStorage : sessionStorage;
  }
}
