import { HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';

import { finalize } from 'rxjs';

import { LoadingService } from '../../services/loading/loading';

import { SKIP_GLOBAL_LOADING } from '../http-context-tokens';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.context.get(SKIP_GLOBAL_LOADING)) {
    return next(request);
  }

  const loadingService = inject(LoadingService);

  loadingService.start();

  return next(request).pipe(
    finalize(() => {
      loadingService.stop();
    }),
  );
};
