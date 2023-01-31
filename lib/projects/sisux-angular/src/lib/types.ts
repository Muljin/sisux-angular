import { Configuration } from '@azure/msal-browser';

export type BasicConfiguration = {
  clientId: string;
  sisuxTenantId: string;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type Overrides = DeepPartial<Configuration>;
