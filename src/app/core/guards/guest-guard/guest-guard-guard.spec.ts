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
  guestGuard
} from './guest-guard-guard';

@Component({
  selector:
    'app-login-test-page',

  template: `
    <h1>Login Page</h1>
  `
})
class LoginTestPage {}

@Component({
  selector:
    'app-account-test-page',

  template: `
    <h1>Account Page</h1>
  `
})
class AccountTestPage {}

@Component({
  selector:
    'app-checkout-test-page',

  template: `
    <h1>Checkout Page</h1>
  `
})
class CheckoutTestPage {}

const TEST_ROUTES:
  Routes = [
    {
      path: 'auth/login',

      canActivate: [
        guestGuard
      ],

      component:
        LoginTestPage
    },

    {
      path: 'account',

      component:
        AccountTestPage
    },

    {
      path: 'checkout',

      component:
        CheckoutTestPage
    }
  ];

describe('guestGuard', () => {
  const authenticatedState =
    signal(false);

  let router:
    Router;

  beforeEach(() => {
    TestBed.resetTestingModule();

    authenticatedState.set(
      false
    );

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
    'should allow an unauthenticated user to open login',
    async () => {
      authenticatedState.set(
        false
      );

      const harness =
        await RouterTestingHarness
          .create();

      const component =
        await harness.navigateByUrl(
          '/auth/login',

          LoginTestPage
        );

      expect(
        component
      ).toBeInstanceOf(
        LoginTestPage
      );

      expect(
        router.url
      ).toBe(
        '/auth/login'
      );

      expect(
        harness.routeNativeElement
          ?.textContent
      ).toContain(
        'Login Page'
      );
    }
  );

  it(
    'should redirect an authenticated user to account',
    async () => {
      authenticatedState.set(
        true
      );

      const harness =
        await RouterTestingHarness
          .create();

      await harness.navigateByUrl(
        '/auth/login'
      );

      expect(
        router.url
      ).toBe(
        '/account'
      );

      expect(
        harness.routeNativeElement
          ?.textContent
      ).toContain(
        'Account Page'
      );
    }
  );

  it(
    'should redirect an authenticated user to a safe returnUrl',
    async () => {
      authenticatedState.set(
        true
      );

      const harness =
        await RouterTestingHarness
          .create();

      await harness.navigateByUrl(
        '/auth/login?returnUrl=%2Fcheckout'
      );

      expect(
        router.url
      ).toBe(
        '/checkout'
      );

      expect(
        harness.routeNativeElement
          ?.textContent
      ).toContain(
        'Checkout Page'
      );
    }
  );

  it(
    'should reject an external returnUrl',
    async () => {
      authenticatedState.set(
        true
      );

      const harness =
        await RouterTestingHarness
          .create();

      await harness.navigateByUrl(
        '/auth/login?returnUrl=%2F%2Fevil.example'
      );

      expect(
        router.url
      ).toBe(
        '/account'
      );

      expect(
        harness.routeNativeElement
          ?.textContent
      ).toContain(
        'Account Page'
      );
    }
  );
});