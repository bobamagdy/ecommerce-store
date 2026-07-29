import {
  provideZonelessChangeDetection
} from '@angular/core';

import {
  TestBed
} from '@angular/core/testing';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it
} from 'vitest';

import {
  Product
} from '../../models/product.model';

import {
  BROWSER_STORAGE
} from '../../tokens/browser-storage';

import {
  CartService
} from './cart';

class MemoryStorage
  implements Storage {

  private readonly values =
    new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(
    key: string
  ): string | null {
    return (
      this.values.get(key) ??
      null
    );
  }

  key(
    index: number
  ): string | null {
    return (
      Array.from(
        this.values.keys()
      )[index] ?? null
    );
  }

  removeItem(
    key: string
  ): void {
    this.values.delete(key);
  }

  setItem(
    key: string,
    value: string
  ): void {
    this.values.set(
      key,
      value
    );
  }
}

const PRODUCT: Product = {
  id: 1,
  name: 'Test Product',
  category: 'Electronics',
  brand: 'Test Brand',
  price: 20,
  rating: 4.5,
  reviews: 10,
  image: '/images/product.jpg',
  images: [
    '/images/product.jpg'
  ],
  description:
    'Test product description.',
  stock: 5,
  sku: 'TEST-001'
};

describe('CartService', () => {
  let storage:
    MemoryStorage;

  beforeEach(() => {
    TestBed.resetTestingModule();

    storage =
      new MemoryStorage();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function createService(
    providedStorage:
      Storage | null = storage
  ): CartService {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),

        {
          provide:
            BROWSER_STORAGE,

          useValue:
            providedStorage
        }
      ]
    });

    const service =
      TestBed.inject(
        CartService
      );

    /*
     * تشغيل Root Effect الخاصة
     * بحفظ السلة.
     */
    TestBed.tick();

    return service;
  }

  it(
    'should start with an empty cart',
    () => {
      const service =
        createService();

      expect(
        service.items()
      ).toEqual([]);

      expect(
        service.totalQuantity()
      ).toBe(0);

      expect(
        service.subtotal()
      ).toBe(0);

      expect(
        service.shipping()
      ).toBe(0);

      expect(
        service.tax()
      ).toBe(0);

      expect(
        service.total()
      ).toBe(0);
    }
  );

  it(
    'should add a product and calculate totals',
    () => {
      const service =
        createService();

      service.setProductQuantity(
        PRODUCT,
        2
      );

      expect(
        service.items()
      ).toEqual([
        {
          product: PRODUCT,
          quantity: 2
        }
      ]);

      expect(
        service.totalQuantity()
      ).toBe(2);

      expect(
        service.subtotal()
      ).toBe(40);

      expect(
        service.shipping()
      ).toBe(9.99);

      expect(
        service.tax()
      ).toBeCloseTo(3.2);

      expect(
        service.total()
      ).toBeCloseTo(53.19);
    }
  );

  it(
    'should provide free shipping for orders of fifty dollars or more',
    () => {
      const service =
        createService();

      service.setProductQuantity(
        PRODUCT,
        3
      );

      expect(
        service.subtotal()
      ).toBe(60);

      expect(
        service.shipping()
      ).toBe(0);

      expect(
        service.total()
      ).toBeCloseTo(64.8);
    }
  );

  it(
    'should clamp quantity to available stock',
    () => {
      const service =
        createService();

      service.setProductQuantity(
        PRODUCT,
        100
      );

      expect(
        service.getProductQuantity(
          PRODUCT.id
        )
      ).toBe(5);
    }
  );

  it(
    'should accumulate quantities when adding the same product',
    () => {
      const service =
        createService();

      service.addProduct(
        PRODUCT,
        2
      );

      service.addProduct(
        PRODUCT,
        2
      );

      expect(
        service.getProductQuantity(
          PRODUCT.id
        )
      ).toBe(4);

      service.addProduct(
        PRODUCT,
        10
      );

      expect(
        service.getProductQuantity(
          PRODUCT.id
        )
      ).toBe(5);
    }
  );

  it(
    'should increase and decrease quantity',
    () => {
      const service =
        createService();

      service.setProductQuantity(
        PRODUCT,
        2
      );

      service.increaseQuantity(
        PRODUCT.id
      );

      expect(
        service.getProductQuantity(
          PRODUCT.id
        )
      ).toBe(3);

      service.decreaseQuantity(
        PRODUCT.id
      );

      expect(
        service.getProductQuantity(
          PRODUCT.id
        )
      ).toBe(2);
    }
  );

  it(
    'should not decrease below one using decreaseQuantity',
    () => {
      const service =
        createService();

      service.setProductQuantity(
        PRODUCT,
        1
      );

      service.decreaseQuantity(
        PRODUCT.id
      );

      expect(
        service.getProductQuantity(
          PRODUCT.id
        )
      ).toBe(1);
    }
  );

  it(
    'should remove the product using decreaseOrRemoveProduct',
    () => {
      const service =
        createService();

      service.setProductQuantity(
        PRODUCT,
        1
      );

      service
        .decreaseOrRemoveProduct(
          PRODUCT.id
        );

      expect(
        service.isProductInCart(
          PRODUCT.id
        )
      ).toBe(false);
    }
  );

  it(
    'should remove and clear cart items',
    () => {
      const service =
        createService();

      service.addProduct(
        PRODUCT
      );

      service.removeProduct(
        PRODUCT.id
      );

      expect(
        service.items()
      ).toEqual([]);

      service.addProduct(
        PRODUCT,
        2
      );

      service.clearCart();

      expect(
        service.items()
      ).toEqual([]);
    }
  );

  it(
    'should save cart changes in storage',
    () => {
      const service =
        createService();

      service.setProductQuantity(
        PRODUCT,
        2
      );

      /*
       * Effects تعمل أثناء
       * synchronization cycle.
       */
      TestBed.tick();

      const savedValue =
        storage.getItem(
          'hebashop-cart'
        );

      expect(
        savedValue
      ).not.toBeNull();

      expect(
        JSON.parse(
          savedValue ?? '[]'
        )
      ).toEqual([
        {
          product: PRODUCT,
          quantity: 2
        }
      ]);
    }
  );

  it(
    'should load a valid saved cart',
    () => {
      storage.setItem(
        'hebashop-cart',

        JSON.stringify([
          {
            product: PRODUCT,
            quantity: 3
          }
        ])
      );

      const service =
        createService();

      expect(
        service.items()
      ).toEqual([
        {
          product: PRODUCT,
          quantity: 3
        }
      ]);
    }
  );

  it(
    'should clamp saved quantities to current stock',
    () => {
      storage.setItem(
        'hebashop-cart',

        JSON.stringify([
          {
            product: PRODUCT,
            quantity: 100
          }
        ])
      );

      const service =
        createService();

      expect(
        service.getProductQuantity(
          PRODUCT.id
        )
      ).toBe(5);
    }
  );

  it(
    'should ignore malformed stored data',
    () => {
      storage.setItem(
        'hebashop-cart',
        'invalid-json'
      );

      const service =
        createService();

      expect(
        service.items()
      ).toEqual([]);
    }
  );

  it(
    'should ignore invalid cart items',
    () => {
      storage.setItem(
        'hebashop-cart',

        JSON.stringify([
          {
            product: {
              id: 'invalid'
            },
            quantity: 2
          }
        ])
      );

      const service =
        createService();

      expect(
        service.items()
      ).toEqual([]);
    }
  );

  it(
    'should work without browser storage',
    () => {
      const service =
        createService(null);

      service.addProduct(
        PRODUCT,
        2
      );

      expect(
        service.getProductQuantity(
          PRODUCT.id
        )
      ).toBe(2);
    }
  );
});