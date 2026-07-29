import {
  provideZonelessChangeDetection
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  provideRouter,
  Router
} from '@angular/router';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import {
  AuthService
} from '../../../core/services/auth/auth';

import {
  AccountPage
} from './account-page';

describe('AccountPage', () => {
  let component:
    AccountPage;

  let fixture:
    ComponentFixture<AccountPage>;

  let router:
    Router;

  const logoutMock =
    vi.fn();

  beforeEach(async () => {
    logoutMock.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        AccountPage
      ],

      providers: [
        provideZonelessChangeDetection(),

        provideRouter([]),

        {
          provide: AuthService,

          useValue: {
            logout:
              logoutMock
          }
        }
      ]
    }).compileComponents();

    router =
      TestBed.inject(Router);

    fixture =
      TestBed.createComponent(
        AccountPage
      );

    component =
      fixture.componentInstance;

    fixture.detectChanges();

    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it(
    'should create',
    () => {
      expect(
        component
      ).toBeTruthy();
    }
  );

  it(
    'should display the account heading',
    () => {
      const hostElement:
        HTMLElement =
          fixture.nativeElement;

      expect(
        hostElement.textContent
      ).toContain(
        'Welcome Back'
      );

      expect(
        hostElement.textContent
      ).toContain(
        'My Orders'
      );

      expect(
        hostElement.textContent
      ).toContain(
        'Wishlist'
      );
    }
  );

  it(
    'should logout and navigate to the login page',
    async () => {
      const navigateSpy =
        vi.spyOn(
          router,
          'navigateByUrl'
        ).mockResolvedValue(true);

      await component.logout();

      expect(
        logoutMock
      ).toHaveBeenCalledOnce();

      expect(
        navigateSpy
      ).toHaveBeenCalledWith(
        '/auth/login'
      );
    }
  );
});