import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import {
  EnvironmentProviders
} from '@angular/core';

import {
  apiErrorInterceptor
} from './interceptors/api-error-interceptor';

import {
  apiUrlInterceptor
} from './interceptors/api-url-interceptor';

import {
  loadingInterceptor
} from './interceptors/loading-interceptor';

export function provideAppHttp():
  EnvironmentProviders {
  return provideHttpClient(
    withInterceptors([
      apiUrlInterceptor,
      loadingInterceptor,
      apiErrorInterceptor
    ])
  );
}