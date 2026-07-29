import {
  Component,
  provideZonelessChangeDetection,
  signal
} from '@angular/core';

import {
  TestBed
} from '@angular/core/testing';

import {
  provideRouter,
  Router,
  Routes
} from '@angular/router';

import {
  RouterTestingHarness
} from '@angular/router/testing';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it
} from 'vitest';

import {
  AuthService
} from '../../services/auth/auth';

import {
  authGuard
} from './auth-guard';

@Component({
  selector:
    'app-protected-test-page',

  template: `
    <h1>Protected Page</h1>
  `
})
class ProtectedTestPage {}

@Component({
  selector:
    'app-login-test-page',

  template: `
    <h1>Login Page</h1>
  `
})
class LoginTestPage {}

const TEST_ROUTES: Routes = [
  {
    path: 'protected',

    canActivate: [
      authGuard
    ],

    component:
      ProtectedTestPage
  },

  {
    path: 'auth/login',

    component:
      LoginTestPage
  }
];

describe('authGuard', () => {
  /*
   * Signal نتحكم منها في حالة
   * المستخدم أثناء كل Test.
   */
  const authenticatedState =
    signal(false);

  let router:
    Router;

  beforeEach(() => {
    TestBed.resetTestingModule();

    authenticatedState.set(false);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),

        provideRouter(
          TEST_ROUTES
        ),

        {
          provide:
            AuthService,

          useValue: {
            isAuthenticated:
              authenticatedState
          }
        }
      ]
    });

    router =
      TestBed.inject(Router);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it(
    'should allow an authenticated user to open the protected route',
    async () => {
      authenticatedState.set(true);

      const harness =
        await RouterTestingHarness
          .create();

      const component =
        await harness.navigateByUrl(
          '/protected',

          ProtectedTestPage
        );

      expect(
        component
      ).toBeInstanceOf(
        ProtectedTestPage
      );

      expect(
        router.url
      ).toBe('/protected');

      expect(
        harness.routeNativeElement
          ?.textContent
      ).toContain(
        'Protected Page'
      );
    }
  );

  it(
    'should redirect an unauthenticated user to login',
    async () => {
      authenticatedState.set(false);

      const harness =
        await RouterTestingHarness
          .create();

      await harness.navigateByUrl(
        '/protected'
      );

      expect(
        router.url.startsWith(
          '/auth/login'
        )
      ).toBe(true);

      expect(
        harness.routeNativeElement
          ?.textContent
      ).toContain(
        'Login Page'
      );
    }
  );

  it(
    'should preserve the requested URL as returnUrl',
    async () => {
      authenticatedState.set(false);

      const harness =
        await RouterTestingHarness
          .create();

      await harness.navigateByUrl(
        '/protected'
      );

      const redirectedUrl =
        router.parseUrl(
          router.url
        );

      expect(
        redirectedUrl.queryParams[
          'returnUrl'
        ]
      ).toBe(
        '/protected'
      );
    }
  );

  it(
    'should allow navigation after authentication changes',
    async () => {
      const harness =
        await RouterTestingHarness
          .create();

      authenticatedState.set(false);

      await harness.navigateByUrl(
        '/protected'
      );

      expect(
        router.url.startsWith(
          '/auth/login'
        )
      ).toBe(true);

      authenticatedState.set(true);

      await harness.navigateByUrl(
        '/protected',

        ProtectedTestPage
      );

      expect(
        router.url
      ).toBe('/protected');

      expect(
        harness.routeNativeElement
          ?.textContent
      ).toContain(
        'Protected Page'
      );
    }
  );
});