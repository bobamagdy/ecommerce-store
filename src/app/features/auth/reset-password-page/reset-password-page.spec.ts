import {
  provideZonelessChangeDetection
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  provideRouter
} from '@angular/router';

import {
  beforeEach,
  describe,
  expect,
  it
} from 'vitest';

import {
  ResetPasswordPage
} from './reset-password-page';

describe('ResetPasswordPage', () => {
  let fixture:
    ComponentFixture<ResetPasswordPage>;

  let component:
    ResetPasswordPage;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        imports: [
          ResetPasswordPage
        ],

        providers: [
          provideZonelessChangeDetection(),
          provideRouter([])
        ]
      })
      .compileComponents();

    fixture =
      TestBed.createComponent(
        ResetPasswordPage
      );

    fixture.componentRef.setInput(
      'token',
      'test-reset-token'
    );

    component =
      fixture.componentInstance;

    await fixture.whenStable();
  });

  it(
    'should create',
    () => {
      expect(component).toBeTruthy();
    }
  );

  it(
    'should receive the reset token',
    () => {
      expect(
        component.token()
      ).toBe(
        'test-reset-token'
      );
    }
  );

  it(
    'should toggle password visibility',
    () => {
      expect(
        component.passwordVisible()
      ).toBe(false);

      component
        .togglePasswordVisibility();

      expect(
        component.passwordVisible()
      ).toBe(true);
    }
  );
});