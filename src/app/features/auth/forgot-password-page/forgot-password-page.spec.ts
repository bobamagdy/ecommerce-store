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
  ForgotPasswordPage
} from './forgot-password-page';

describe('ForgotPasswordPage', () => {
  let fixture:
    ComponentFixture<ForgotPasswordPage>;

  let component:
    ForgotPasswordPage;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        imports: [
          ForgotPasswordPage
        ],

        providers: [
          provideZonelessChangeDetection(),
          provideRouter([])
        ]
      })
      .compileComponents();

    fixture =
      TestBed.createComponent(
        ForgotPasswordPage
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
    'should display the recovery heading',
    () => {
      const hostElement:
        HTMLElement =
          fixture.nativeElement;

      expect(
        hostElement.textContent
      ).toContain(
        'Forgot Your Password?'
      );
    }
  );

  it(
    'should start without a sent request',
    () => {
      expect(
        component.requestSent()
      ).toBe(false);
    }
  );
});