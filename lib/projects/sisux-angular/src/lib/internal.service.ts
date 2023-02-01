import { Injectable } from '@angular/core';
import { lastValueFrom, map, timer } from 'rxjs';
import { BasicConfiguration, Overrides } from './types';

@Injectable({
  providedIn: 'root',
})
export class InternalService {
  public serverConfiguration: any | null = null;
  public rootConfiguration: any | null = null;
  public rootOverrides?: any | null = null;

  constructor() {}

  getServerConfiguration() {
    return lastValueFrom(
      timer(300).pipe(
        map(() => ({
          scopes: ['api://jeeblyops/all'],
          redirectUri: 'http://localhost:4200',
          apiUrl: 'https://jeeblyopsapi-dev.azurewebsites.net',
        }))
      )
    ).then((config) => (this.serverConfiguration = config));
  }

  setRootConfig(config: BasicConfiguration, overrides?: Overrides) {
    this.rootConfiguration = config;
    this.rootOverrides = overrides;
  }
}
