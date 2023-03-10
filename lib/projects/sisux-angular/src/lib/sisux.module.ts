import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
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

@NgModule({
  imports: [MsalModule],
  exports: [MsalModule],
  providers: [
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
  ],
})
export class SisuxModule {
  static forRoot(
    configuration: BasicConfiguration,
    overrides?: Overrides
  ): ModuleWithProviders<SisuxModule> {
    return {
      ngModule: SisuxModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          multi: true,
          deps: [InternalService],
          useFactory: (internalService: InternalService) => {
            internalService.setRootConfig(configuration, overrides);
            return () => internalService.getServerConfiguration();
          },
        },
      ],
    };
  }
}
