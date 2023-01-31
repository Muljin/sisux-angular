import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import {
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
} from '@azure/msal-angular';
import {
  BrowserAuthOptions,
  BrowserCacheLocation,
  CacheOptions,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { InternalService } from './internal.service';
import { BasicConfiguration, Overrides } from './types';

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export async function MSALInstanceFactory(
  internalService: InternalService,
  configuration: BasicConfiguration,
  overrides?: Overrides
): Promise<IPublicClientApplication> {
  const serverConfig = internalService.configuration;

  const auth: BrowserAuthOptions = {
    clientId: configuration.clientId,
    authority: `https://login.microsoftonline.com/${configuration.sisuxTenantId}`,
    redirectUri: serverConfig.redirectUri,
    ...overrides?.auth,
  };
  const cache: CacheOptions = {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    ...overrides?.cache,
  };
  return new PublicClientApplication({
    auth,
    cache,
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Verbose,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(
  internalService: InternalService
): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  const { apiUrl, scopes } = internalService.configuration;

  protectedResourceMap.set(apiUrl, scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(
  internalService: InternalService
): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: internalService.configuration.scopes,
    },
  };
}

@NgModule({
  imports: [HttpClientModule],
})
export class SisuxModule {
  static forRoot(
    configuration: BasicConfiguration,
    overrides: Overrides
  ): ModuleWithProviders<SisuxModule> {
    return {
      ngModule: SisuxModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          multi: true,
          deps: [InternalService],
          useFactory: (internalService: InternalService) => {
            return async () => {
              await internalService.getConfiguration();
            };
          },
        },
        {
          provide: MSAL_INSTANCE,
          deps: [InternalService, configuration, overrides],
          useFactory: MSALInstanceFactory,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MsalInterceptor,
          multi: true,
        },
        {
          provide: MSAL_GUARD_CONFIG,
          deps: [InternalService],
          useFactory: MSALGuardConfigFactory,
        },
        {
          provide: MSAL_INTERCEPTOR_CONFIG,
          deps: [InternalService],
          useFactory: MSALInterceptorConfigFactory,
        },
        MsalService,
        MsalGuard,
        MsalBroadcastService,
      ],
    };
  }
}
