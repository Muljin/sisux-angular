import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InternalService {
  public configuration: any | null = null;

  constructor(private _httpClient: HttpClient) {}

  getConfiguration() {
    return lastValueFrom(
      timer(300).pipe(
        map(() => ({
          scopes: ['api://jeeblyops/all'],
          redirectUri: 'http://localhost:4200',
          apiUrl: 'https://jeeblyopsapi-dev.azurewebsites.net',
        }))
      )
    ).then((config) => (this.configuration = config));
  }
}
