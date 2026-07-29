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
  OrdersPage
} from './orders-page';

describe('OrdersPage', () => {
  let component: OrdersPage;
  let fixture: ComponentFixture<OrdersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OrdersPage
      ],

      providers: [
        provideZonelessChangeDetection(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture =
      TestBed.createComponent(
        OrdersPage
      );

    component =
      fixture.componentInstance;

    fixture.detectChanges();

    await fixture.whenStable();
  });

  it(
    'should create',
    () => {
      expect(component).toBeTruthy();
    }
  );

  it(
    'should display the orders page heading',
    () => {
      const hostElement:
        HTMLElement =
          fixture.nativeElement;

      expect(
        hostElement.textContent
      ).toContain('My Orders');
    }
  );

  it(
    'should display the empty orders message',
    () => {
      const hostElement:
        HTMLElement =
          fixture.nativeElement;

      expect(
        hostElement.textContent
      ).toContain('No orders yet');
    }
  );
});