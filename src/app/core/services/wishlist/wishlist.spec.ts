import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BROWSER_STORAGE } from '../../tokens/browser-storage';
import { WishlistService } from './wishlist';

const PRODUCT_ID_1 = '119c1fb7-f4a5-7b88-a796-0f53a37161de';
const PRODUCT_ID_2 = '229c1fb7-f4a5-7b88-a796-0f53a37161de';
const PRODUCT_ID_3 = '339c1fb7-f4a5-7b88-a796-0f53a37161de';

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

describe('WishlistService', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    TestBed.resetTestingModule();

    storage = new MemoryStorage();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function createService(providedStorage: Storage | null = storage): WishlistService {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: BROWSER_STORAGE,
          useValue: providedStorage,
        },
      ],
    });

    const service = TestBed.inject(WishlistService);

    /*
     * تشغيل Effect المسؤول عن التخزين.
     */
    TestBed.tick();

    return service;
  }

  it('should start with an empty wishlist', () => {
    const service = createService();

    expect(service.productIds()).toEqual([]);
    expect(service.totalItems()).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  it('should add a product', () => {
    const service = createService();

    service.addProduct(PRODUCT_ID_1);

    expect(service.productIds()).toEqual([PRODUCT_ID_1]);
    expect(service.totalItems()).toBe(1);
    expect(service.isFavorite(PRODUCT_ID_1)).toBe(true);
    expect(service.isEmpty()).toBe(false);
  });

  it('should not add the same product twice', () => {
    const service = createService();

    service.addProduct(PRODUCT_ID_1);
    service.addProduct(PRODUCT_ID_1);

    expect(service.productIds()).toEqual([PRODUCT_ID_1]);
    expect(service.totalItems()).toBe(1);
  });

  it('should add and remove a product using toggle', () => {
    const service = createService();

    service.toggleProduct(PRODUCT_ID_2);

    expect(service.isFavorite(PRODUCT_ID_2)).toBe(true);

    service.toggleProduct(PRODUCT_ID_2);

    expect(service.isFavorite(PRODUCT_ID_2)).toBe(false);
    expect(service.productIds()).toEqual([]);
  });

  it('should remove a product', () => {
    const service = createService();

    service.addProduct(PRODUCT_ID_1);
    service.addProduct(PRODUCT_ID_2);

    service.removeProduct(PRODUCT_ID_1);

    expect(service.productIds()).toEqual([PRODUCT_ID_2]);
    expect(service.totalItems()).toBe(1);
  });

  it('should clear the wishlist', () => {
    const service = createService();

    service.addProduct(PRODUCT_ID_1);
    service.addProduct(PRODUCT_ID_2);
    service.addProduct(PRODUCT_ID_3);

    service.clearWishlist();

    expect(service.productIds()).toEqual([]);
    expect(service.totalItems()).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  it('should ignore invalid product ids', () => {
    const service = createService();

    service.addProduct('0');
    service.addProduct('-1');
    service.addProduct('1.5');
    service.addProduct('NaN');
    service.addProduct('invalid-product-id');
    service.addProduct('');

    service.toggleProduct('0');
    service.removeProduct('-1');

    expect(service.productIds()).toEqual([]);
  });

  it('should save wishlist changes in storage', () => {
    const service = createService();

    service.addProduct(PRODUCT_ID_1);
    service.addProduct(PRODUCT_ID_2);

    TestBed.tick();

    const savedValue = storage.getItem('hubshop-wishlist');

    expect(savedValue).not.toBeNull();

    expect(JSON.parse(savedValue ?? '[]')).toEqual([PRODUCT_ID_1, PRODUCT_ID_2]);
  });

  it('should load a saved wishlist', () => {
    storage.setItem('hubshop-wishlist', JSON.stringify([PRODUCT_ID_1, PRODUCT_ID_2, PRODUCT_ID_3]));

    const service = createService();

    expect(service.productIds()).toEqual([PRODUCT_ID_1, PRODUCT_ID_2, PRODUCT_ID_3]);

    expect(service.totalItems()).toBe(3);
    expect(service.isFavorite(PRODUCT_ID_2)).toBe(true);
  });

  it('should remove duplicate stored product ids', () => {
    storage.setItem(
      'hubshop-wishlist',
      JSON.stringify([PRODUCT_ID_1, PRODUCT_ID_1, PRODUCT_ID_2, PRODUCT_ID_2, PRODUCT_ID_3]),
    );

    const service = createService();

    expect(service.productIds()).toEqual([PRODUCT_ID_1, PRODUCT_ID_2, PRODUCT_ID_3]);
  });

  it('should ignore invalid stored values', () => {
    storage.setItem(
      'hubshop-wishlist',
      JSON.stringify([PRODUCT_ID_1, 'invalid', '-2', '2.5', 'null', PRODUCT_ID_3]),
    );

    const service = createService();

    expect(service.productIds()).toEqual([PRODUCT_ID_1, PRODUCT_ID_3]);
  });

  it('should ignore a stored value that is not an array', () => {
    storage.setItem(
      'hubshop-wishlist',
      JSON.stringify({
        productId: PRODUCT_ID_1,
      }),
    );

    const service = createService();

    expect(service.productIds()).toEqual([]);
  });

  it('should handle malformed stored JSON', () => {
    storage.setItem('hubshop-wishlist', 'invalid-json');

    const service = createService();

    expect(service.productIds()).toEqual([]);

    /*
     * بعد تشغيل Effect يتم استبدال البيانات التالفة
     * بقائمة صحيحة فارغة.
     */
    TestBed.tick();

    expect(storage.getItem('hubshop-wishlist')).toBe('[]');
  });

  it('should work without browser storage', () => {
    const service = createService(null);

    service.addProduct(PRODUCT_ID_2);
    service.addProduct(PRODUCT_ID_1);

    expect(service.productIds()).toEqual([PRODUCT_ID_2, PRODUCT_ID_1]);
    expect(service.totalItems()).toBe(2);
  });
});
