import { provideZonelessChangeDetection, signal } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { StoreOrder } from '../../../core/models/order.model';

import { OrderService } from '../../../core/services/order/order';

import { OrdersPage } from './orders-page';

describe('OrdersPage', () => {
  let component: OrdersPage;

  let fixture: ComponentFixture<OrdersPage>;

  const ordersState = signal<StoreOrder[]>([]);

  const totalOrdersState = signal(0);

  const isEmptyState = signal(true);

  beforeEach(async () => {
    ordersState.set([]);
    totalOrdersState.set(0);
    isEmptyState.set(true);

    await TestBed.configureTestingModule({
      imports: [OrdersPage],

      providers: [
        provideZonelessChangeDetection(),

        provideRouter([]),

        {
          provide: OrderService,

          useValue: {
            orders: ordersState.asReadonly(),

            totalOrders: totalOrdersState.asReadonly(),

            isEmpty: isEmptyState.asReadonly(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersPage);

    component = fixture.componentInstance;

    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the orders heading', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.textContent).toContain('My Orders');
  });

  it('should display the empty orders state', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.textContent).toContain('No orders yet');
  });

  it('should return the correct status icon', () => {
    expect(component.getStatusIcon('processing')).toBe('pi-clock');

    expect(component.getStatusIcon('shipped')).toBe('pi-truck');

    expect(component.getStatusIcon('delivered')).toBe('pi-verified');
  });
});
