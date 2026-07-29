import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';

import { catchError, throwError } from 'rxjs';

import { ApiErrorService } from '../../services/api-error/api-error';

import { SKIP_GLOBAL_ERROR } from '../http-context-tokens';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const apiErrorService = inject(ApiErrorService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && !request.context.get(SKIP_GLOBAL_ERROR)) {
        apiErrorService.report(error);
      }

      return throwError(() => error);
    }),
  );
};
