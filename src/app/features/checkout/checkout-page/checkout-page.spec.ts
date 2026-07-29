import {
  provideZonelessChangeDetection,
  signal
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
  it,
  vi
} from 'vitest';

import {
  CartItem,
  CartService
} from '../../../core/services/cart/cart';

import {
  OrderService
} from '../../../core/services/order/order';

import {
  CheckoutPage
} from './checkout-page';

describe('CheckoutPage', () => {
  let component:
    CheckoutPage;

  let fixture:
    ComponentFixture<CheckoutPage>;

  const cartItemsState =
    signal<CartItem[]>([]);

  const subtotalState =
    signal(0);

  const shippingState =
    signal(0);

  const taxState =
    signal(0);

  const totalState =
    signal(0);

  const clearCartMock =
    vi.fn();

  const createOrderMock =
    vi.fn();

  beforeEach(async () => {
    cartItemsState.set([]);
    subtotalState.set(0);
    shippingState.set(0);
    taxState.set(0);
    totalState.set(0);

    clearCartMock.mockClear();
    createOrderMock.mockClear();

    await TestBed
      .configureTestingModule({
        imports: [
          CheckoutPage
        ],

        providers: [
          provideZonelessChangeDetection(),

          provideRouter([]),

          {
            provide:
              CartService,

            useValue: {
              items:
                cartItemsState
                  .asReadonly(),

              subtotal:
                subtotalState
                  .asReadonly(),

              shipping:
                shippingState
                  .asReadonly(),

              tax:
                taxState
                  .asReadonly(),

              total:
                totalState
                  .asReadonly(),

              clearCart:
                clearCartMock
            }
          },

          {
            provide:
              OrderService,

            useValue: {
              createOrder:
                createOrderMock
            }
          }
        ]
      })
      .compileComponents();

    fixture =
      TestBed.createComponent(
        CheckoutPage
      );

    component =
      fixture.componentInstance;

    fixture.detectChanges();

    await fixture.whenStable();
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
    'should display the empty cart state',
    () => {
      const hostElement:
        HTMLElement =
          fixture.nativeElement;

      expect(
        hostElement.textContent
      ).toContain(
        'Your cart is empty'
      );
    }
  );

  it(
    'should report no pending changes initially',
    () => {
      expect(
        component
          .hasPendingChanges()
      ).toBe(false);
    }
  );

  it(
    'should not create an order when the cart is empty',
    async () => {
      await component.placeOrder(
        new Event('submit')
      );

      expect(
        createOrderMock
      ).not.toHaveBeenCalled();

      expect(
        clearCartMock
      ).not.toHaveBeenCalled();
    }
  );
});