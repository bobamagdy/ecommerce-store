import { provideZonelessChangeDetection, signal } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { StoreOrder } from '../../../../core/models/order.model';

import { Product } from '../../../../core/models/product.model';

import { OrderService } from '../../../../core/services/order/order';

import { ProductService } from '../../../../core/services/product/product';

import { AdminDashboard } from './admin-dashboard';

describe('AdminDashboard', () => {
  let component: AdminDashboard;

  let fixture: ComponentFixture<AdminDashboard>;

  const productsState = signal<Product[]>([]);

  const ordersState = signal<StoreOrder[]>([]);

  const totalOrdersState = signal(0);

  beforeEach(async () => {
    productsState.set([]);
    ordersState.set([]);
    totalOrdersState.set(0);

    await TestBed.configureTestingModule({
      imports: [AdminDashboard],

      providers: [
        provideZonelessChangeDetection(),

        provideRouter([]),

        {
          provide: ProductService,

          useValue: {
            products: productsState.asReadonly(),
          },
        },

        {
          provide: OrderService,

          useValue: {
            orders: ordersState.asReadonly(),

            totalOrders: totalOrdersState.asReadonly(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboard);

    component = fixture.componentInstance;

    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the dashboard heading', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.textContent).toContain('Dashboard');

    expect(hostElement.textContent).toContain('Recent Orders');
  });

  it('should start with empty dashboard statistics', () => {
    expect(component.totalProducts()).toBe(0);

    expect(component.totalOrders()).toBe(0);

    expect(component.totalRevenue()).toBe(0);

    expect(component.lowStockProducts()).toBe(0);

    expect(component.recentOrders()).toEqual([]);
  });

  it('should display the empty orders state', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.textContent).toContain('No orders have been created yet.');
  });
});
