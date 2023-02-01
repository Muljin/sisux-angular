import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { BrowserUtils } from '@azure/msal-browser';
import { provideSisux } from 'sisux-angular';
import { AppComponent } from './app/app.component';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app/routes';

const routerProviders =
  !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
    ? provideRouter(routes)
    : provideRouter(routes, withDisabledInitialNavigation());

bootstrapApplication(AppComponent, {
  providers: [
    provideSisux({
      clientId: '',
      sisuxTenantId: '',
    }),
    provideHttpClient(withInterceptorsFromDi()),
    routerProviders,
  ],
}).catch((err) => console.error(err));
