import { provideZonelessChangeDetection } from '@angular/core';

import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateOrderInput } from '../../models/order.model';

import { Product } from '../../models/product.model';

import { BROWSER_STORAGE } from '../../tokens/browser-storage';

import { OrderService } from './order';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

const PRODUCT: Product = {
  id: '019c1fb7-f4a5-7b88-a796-0f53a37161de',
  name: 'Test Product',
  category: 'Electronics',
  brand: 'Test Brand',
  price: 20,
  rating: 4.5,
  reviews: 10,
  image: '/images/product.jpg',
  images: ['/images/product.jpg'],
  description: 'Test product.',
  stock: 10,
  sku: 'TEST-001',
  oldPrice: 50,
  badge: 'Sale',
};

const ORDER_INPUT: CreateOrderInput = {
  customer: {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '12345678',
    country: 'Saudi Arabia',
    city: 'Riyadh',
    address: 'Test street address',
    postalCode: '12345',
  },

  paymentMethod: 'card',

  items: [
    {
      product: PRODUCT,
      quantity: 2,
    },
  ],

  subtotal: 40,
  shipping: 9.99,
  tax: 3.2,
  total: 53.19,
};

describe('OrderService', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    TestBed.resetTestingModule();

    storage = new MemoryStorage();
  });

  afterEach(() => {
    vi.restoreAllMocks();

    TestBed.resetTestingModule();
  });

  function createService(providedStorage: Storage | null = storage): OrderService {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),

        {
          provide: BROWSER_STORAGE,

          useValue: providedStorage,
        },
      ],
    });

    const service = TestBed.inject(OrderService);

    TestBed.tick();

    return service;
  }

  it('should start with no orders', () => {
    const service = createService();

    expect(service.orders()).toEqual([]);

    expect(service.totalOrders()).toBe(0);

    expect(service.isEmpty()).toBe(true);

    expect(service.latestOrder()).toBeNull();
  });

  it('should create an order', () => {
    const service = createService();

    const order = service.createOrder(ORDER_INPUT);

    expect(order.orderNumber).toMatch(/^HS-/);

    expect(order.status).toBe('processing');

    expect(order.items).toHaveLength(1);

    expect(order.items[0].quantity).toBe(2);

    expect(order.items[0].lineTotal).toBe(40);

    expect(service.totalOrders()).toBe(1);

    expect(service.latestOrder()).toEqual(order);
  });

  it('should preserve order totals', () => {
    const service = createService();

    const order = service.createOrder(ORDER_INPUT);

    expect(order.subtotal).toBe(40);

    expect(order.shipping).toBe(9.99);

    expect(order.tax).toBe(3.2);

    expect(order.total).toBe(53.19);
  });

  it('should find an order by id', () => {
    const service = createService();

    const order = service.createOrder(ORDER_INPUT);

    expect(service.getOrderById(order.id)).toEqual(order);

    expect(service.getOrderById('missing-order')).toBeUndefined();
  });

  it('should update order status', () => {
    const service = createService();

    const order = service.createOrder(ORDER_INPUT);

    service.updateOrderStatus(order.id, 'shipped');

    expect(service.getOrderById(order.id)?.status).toBe('shipped');
  });

  it('should save orders in storage', () => {
    const service = createService();

    service.createOrder(ORDER_INPUT);

    TestBed.tick();

    const savedOrders = JSON.parse(storage.getItem('hubshop-orders') ?? '[]');

    expect(savedOrders).toHaveLength(1);

    expect(savedOrders[0].total).toBe(53.19);
  });

  it('should load stored orders', () => {
    const originalService = createService();

    const order = originalService.createOrder(ORDER_INPUT);

    TestBed.tick();

    TestBed.resetTestingModule();

    const restoredService = createService();

    expect(restoredService.orders()).toEqual([order]);

    expect(restoredService.totalOrders()).toBe(1);
  });

  it('should clear all orders', () => {
    const service = createService();

    service.createOrder(ORDER_INPUT);

    service.clearOrders();

    expect(service.orders()).toEqual([]);

    expect(service.isEmpty()).toBe(true);
  });

  it('should recover from malformed stored JSON', () => {
    storage.setItem('hubshop-orders', 'invalid-json');

    const service = createService();

    expect(service.orders()).toEqual([]);

    TestBed.tick();

    expect(storage.getItem('hubshop-orders')).toBe('[]');
  });

  it('should work without browser storage', () => {
    const service = createService(null);

    service.createOrder(ORDER_INPUT);

    expect(service.totalOrders()).toBe(1);
  });
});
