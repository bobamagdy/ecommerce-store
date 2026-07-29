import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService
} from '../../services/auth/auth';

export const guestGuard:
  CanActivateFn = (
    route
  ) => {
    const authService =
      inject(AuthService);

    const router =
      inject(Router);

    /*
     * المستخدم غير المسجل مسموح له
     * بفتح Login وRegister.
     */
    if (
      !authService.isAuthenticated()
    ) {
      return true;
    }

    /*
     * المستخدم المسجل لا يحتاج
     * صفحات Authentication.
     */
    const returnUrl =
      route.queryParamMap.get(
        'returnUrl'
      );

    /*
     * نقبل فقط Internal URLs.
     *
     * /checkout       صحيح
     * /account/orders صحيح
     * //external.com  مرفوض
     */
    if (
      returnUrl !== null &&
      returnUrl.startsWith('/') &&
      !returnUrl.startsWith('//')
    ) {
      return router.parseUrl(
        returnUrl
      );
    }

    return router.createUrlTree([
      '/account'
    ]);
  };