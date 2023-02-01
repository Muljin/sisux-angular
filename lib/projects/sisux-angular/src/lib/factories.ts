import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
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

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(
  internalService: InternalService
): IPublicClientApplication {
  const rootConfig = internalService.rootConfiguration;
  const rootOverrides = internalService.rootOverrides;
  const serverConfig = internalService.serverConfiguration;

  const auth: BrowserAuthOptions = {
    clientId: rootConfig.clientId,
    authority: `https://login.microsoftonline.com/${rootConfig.sisuxTenantId}`,
    redirectUri: serverConfig.redirectUri,
    ...rootOverrides?.auth,
  };
  const cache: CacheOptions = {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    ...rootOverrides?.cache,
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
  const { apiUrl, scopes } = internalService.serverConfiguration;

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
      scopes: internalService.serverConfiguration.scopes,
    },
  };
}
