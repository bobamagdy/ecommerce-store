import { HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';

import { API_CONFIG } from '../../tokens/api-config';

const API_REQUEST_PREFIX = 'api/';

export const apiUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(API_REQUEST_PREFIX)) {
    return next(request);
  }

  const apiConfig = inject(API_CONFIG);

  const normalizedBaseUrl = apiConfig.baseUrl.replace(/\/+$/, '');

  const relativeUrl = request.url.slice(API_REQUEST_PREFIX.length).replace(/^\/+/, '');

  const apiRequest = request.clone({
    url: `${normalizedBaseUrl}/${relativeUrl}`,
  });

  return next(apiRequest);
};
