import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  APP_INITIALIZER,
  EnvironmentProviders,
  importProvidersFrom,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import {
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
} from '@azure/msal-angular';
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MSALInterceptorConfigFactory,
} from './factories';
import { InternalService } from './internal.service';
import { BasicConfiguration, Overrides } from './types';

export const provideSisux = (
  configuration: BasicConfiguration,
  overrides?: Overrides
): EnvironmentProviders => {
  const providers = [
    importProvidersFrom([MsalModule]),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const internalService = inject(InternalService);
        internalService.setRootConfig(configuration, overrides);
        return () => internalService.getServerConfiguration();
      },
    },
    {
      provide: MSAL_INSTANCE,
      deps: [InternalService],
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
  ];

  return makeEnvironmentProviders(providers);
};
