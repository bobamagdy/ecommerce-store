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
  App
} from './app';

describe('App', () => {
  let fixture:
    ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        imports: [
          App
        ],

        providers: [
          provideZonelessChangeDetection(),

          provideRouter([])
        ]
      })
      .compileComponents();

    fixture =
      TestBed.createComponent(App);

    fixture.detectChanges();
  });

  it(
    'should create the application',
    () => {
      expect(
        fixture.componentInstance
      ).toBeTruthy();
    }
  );

  it(
    'should contain the root router outlet',
    () => {
      const hostElement =
        fixture.nativeElement  as HTMLElement;

      const routerOutlet =
        hostElement.querySelector(
          'router-outlet'
        );

      expect(
        routerOutlet
      ).not.toBeNull();
    }
  );
});