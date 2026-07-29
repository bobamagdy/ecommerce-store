import { ApplicationRef } from '@angular/core';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Product } from '../../models/product.model';

import { ProductService } from './product';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Sony Wireless Headphones',
    category: 'Electronics',
    brand: 'Sony',
    price: 150,
    oldPrice: 200,
    rating: 4.8,
    reviews: 320,
    badge: 'Sale',
    image: '/images/headphones.jpg',
    images: ['/images/headphones.jpg'],
    description: 'Wireless headphones with noise cancellation.',
    stock: 10,
    sku: 'SONY-001',
  },

  {
    id: 2,
    name: 'Nike Running Shoes',
    category: 'Fashion',
    brand: 'Nike',
    price: 120,
    rating: 4.5,
    reviews: 180,
    image: '/images/shoes.jpg',
    images: ['/images/shoes.jpg'],
    description: 'Comfortable running shoes.',
    stock: 6,
    sku: 'NIKE-002',
  },
];

describe('ProductService', () => {
  let service: ProductService;

  let httpTesting: HttpTestingController;

  let applicationRef: ApplicationRef;

  beforeEach(() => {
    /*
     * نضمن أن كل Test تبدأ
     * ببيئة Angular جديدة تمامًا.
     */
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductService);

    httpTesting = TestBed.inject(HttpTestingController);

    applicationRef = TestBed.inject(ApplicationRef);

    /*
     * تشغيل الـEffect التي تبدأ
     * طلب httpResource.
     */
    TestBed.tick();
  });

  afterEach(() => {
    /*
     * نتأكد أن كل HTTP Requests
     * تم التعامل معها.
     *
     * finally تضمن تنظيف TestBed
     * حتى لو verify وجدت مشكلة.
     */
    try {
      httpTesting.verify();
    } finally {
      TestBed.resetTestingModule();
    }
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();

    /*
     * حتى Test الإنشاء لديها Request
     * لأن httpResource تبدأ فور إنشاء الخدمة.
     */
    const request = httpTesting.expectOne('/data/products.json');

    request.flush([]);
  });

  it('should request products using GET', () => {
    const request = httpTesting.expectOne({
      method: 'GET',
      url: '/data/products.json',
    });

    expect(request.request.body).toBeNull();

    request.flush(MOCK_PRODUCTS);
  });

  it('should expose initial loading state', () => {
    expect(service.products()).toEqual([]);

    expect(service.isLoading()).toBe(true);

    expect(service.isInitialLoading()).toBe(true);

    expect(service.hasBlockingError()).toBe(false);

    const request = httpTesting.expectOne('/data/products.json');

    request.flush(MOCK_PRODUCTS);
  });

  it('should expose loaded products', async () => {
    const request = httpTesting.expectOne('/data/products.json');

    request.flush(MOCK_PRODUCTS);

    await applicationRef.whenStable();

    expect(service.products()).toEqual(MOCK_PRODUCTS);

    expect(service.isLoading()).toBe(false);

    expect(service.isInitialLoading()).toBe(false);

    expect(service.error()).toBeUndefined();

    expect(service.status()).toBe('resolved');

    expect(service.statusCode()).toBe(200);
  });

  it('should find a product by id', async () => {
    const request = httpTesting.expectOne('/data/products.json');

    request.flush(MOCK_PRODUCTS);

    await applicationRef.whenStable();

    expect(service.getProductById(2)).toEqual(MOCK_PRODUCTS[1]);
  });

  it('should return undefined when product does not exist', async () => {
    const request = httpTesting.expectOne('/data/products.json');

    request.flush(MOCK_PRODUCTS);

    await applicationRef.whenStable();

    expect(service.getProductById(999)).toBeUndefined();
  });

  it('should expose a blocking error when initial request fails', async () => {
    const request = httpTesting.expectOne('/data/products.json');

    request.flush('Products request failed', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    await applicationRef.whenStable();

    expect(service.products()).toEqual([]);

    expect(service.isLoading()).toBe(false);

    expect(service.hasBlockingError()).toBe(true);

    expect(service.error()).toBeDefined();

    expect(service.status()).toBe('error');

    expect(service.statusCode()).toBe(500);

    expect(service.errorMessage().length).toBeGreaterThan(0);
  });

  it('should reload products and preserve the old value while loading', async () => {
    const initialRequest = httpTesting.expectOne('/data/products.json');

    initialRequest.flush(MOCK_PRODUCTS);

    await applicationRef.whenStable();

    const updatedProducts: Product[] = [
      ...MOCK_PRODUCTS,

      {
        id: 3,
        name: 'Apple Watch',
        category: 'Electronics',
        brand: 'Apple',
        price: 399,
        rating: 4.9,
        reviews: 245,
        image: '/images/watch.jpg',
        images: ['/images/watch.jpg'],
        description: 'Smart watch with fitness tracking.',
        stock: 8,
        sku: 'APPLE-003',
      },
    ];

    const reloadStarted = service.reloadProducts();

    expect(reloadStarted).toBe(true);

    /*
     * تشغيل Effect إعادة التحميل.
     */
    TestBed.tick();

    const reloadRequest = httpTesting.expectOne('/data/products.json');

    expect(service.products()).toEqual(MOCK_PRODUCTS);

    expect(service.isReloading()).toBe(true);

    reloadRequest.flush(updatedProducts);

    await applicationRef.whenStable();

    expect(service.products()).toEqual(updatedProducts);

    expect(service.isReloading()).toBe(false);

    expect(service.getProductById(3)).toEqual(updatedProducts[2]);
  });
});
