import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ProductListItemDto } from '../../models/catalog-api.models';
import { PagedResult } from '../../models/paged-result.model';
import { Product } from '../../models/product.model';
import { ProductService } from './product';

const PRODUCTS_URL = 'api/products?page=1&pageSize=12&sortBy=newest';

const SONY_PRODUCT_ID = '019c1fb7-f4a5-7b88-a796-0f53a37161de';

const NIKE_PRODUCT_ID = '019c1fb7-f4a5-7b88-a796-0f53a37161df';

const APPLE_PRODUCT_ID = '019c1fb7-f4a5-7b88-a796-0f53a37161d0';

const MOCK_API_PRODUCTS: ProductListItemDto[] = [
  {
    id: SONY_PRODUCT_ID,
    name: 'Sony Wireless Headphones',
    category: 'Electronics',
    brand: 'Sony',
    price: 150,
    oldPrice: 200,
    rating: 4.8,
    reviews: 320,
    stock: 10,
    badge: 'Sale',
    image: '/images/headphones.jpg',
  },
  {
    id: NIKE_PRODUCT_ID,
    name: 'Nike Running Shoes',
    category: 'Fashion',
    brand: 'Nike',
    price: 120,
    oldPrice: 150,
    rating: 4.5,
    reviews: 180,
    stock: 6,
    badge: 'New',
    image: '/images/shoes.jpg',
  },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: SONY_PRODUCT_ID,
    name: 'Sony Wireless Headphones',
    category: 'Electronics',
    brand: 'Sony',
    price: 150,
    oldPrice: 200,
    rating: 4.8,
    reviews: 320,
    stock: 10,
    badge: 'Sale',
    image: '/images/headphones.jpg',
    images: ['/images/headphones.jpg'],
    description: '',
    sku: '',
  },
  {
    id: NIKE_PRODUCT_ID,
    name: 'Nike Running Shoes',
    category: 'Fashion',
    brand: 'Nike',
    price: 120,
    oldPrice: 150,
    rating: 4.5,
    reviews: 180,
    stock: 6,
    badge: 'New',
    image: '/images/shoes.jpg',
    images: ['/images/shoes.jpg'],
    description: '',
    sku: '',
  },
];

function createPagedResult(items: ProductListItemDto[]): PagedResult<ProductListItemDto> {
  return {
    items,
    page: 1,
    pageSize: 12,
    totalCount: items.length,
    totalPages: items.length === 0 ? 0 : 1,
    hasPreviousPage: false,
    hasNextPage: false,
  };
}

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;
  let applicationRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProductService],
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
    applicationRef = TestBed.inject(ApplicationRef);

    /*
     * تشغيل الـ Effect التي تبدأ طلب httpResource.
     */
    TestBed.tick();
  });

  afterEach(() => {
    httpTesting.verify();
    TestBed.resetTestingModule();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();

    const request = httpTesting.expectOne(PRODUCTS_URL);

    request.flush(createPagedResult([]));
  });

  it('should request products using GET', () => {
    const request = httpTesting.expectOne({
      method: 'GET',
      url: PRODUCTS_URL,
    });

    expect(request.request.body).toBeNull();

    request.flush(createPagedResult(MOCK_API_PRODUCTS));
  });

  it('should expose initial loading state', () => {
    expect(service.products()).toEqual([]);
    expect(service.isLoading()).toBe(true);
    expect(service.isInitialLoading()).toBe(true);
    expect(service.hasBlockingError()).toBe(false);

    const request = httpTesting.expectOne(PRODUCTS_URL);

    request.flush(createPagedResult(MOCK_API_PRODUCTS));
  });

  it('should expose loaded products', async () => {
    const request = httpTesting.expectOne(PRODUCTS_URL);

    request.flush(createPagedResult(MOCK_API_PRODUCTS));

    await applicationRef.whenStable();

    expect(service.products()).toEqual(MOCK_PRODUCTS);
    expect(service.isLoading()).toBe(false);
    expect(service.isInitialLoading()).toBe(false);
    expect(service.error()).toBeUndefined();
    expect(service.status()).toBe('resolved');
    expect(service.statusCode()).toBe(200);
  });

  it('should find a product by id', async () => {
    const request = httpTesting.expectOne(PRODUCTS_URL);

    request.flush(createPagedResult(MOCK_API_PRODUCTS));

    await applicationRef.whenStable();

    expect(service.getProductById(NIKE_PRODUCT_ID)).toEqual(MOCK_PRODUCTS[1]);
  });

  it('should return undefined when product does not exist', async () => {
    const request = httpTesting.expectOne(PRODUCTS_URL);

    request.flush(createPagedResult(MOCK_API_PRODUCTS));

    await applicationRef.whenStable();

    expect(service.getProductById('999')).toBeUndefined();
  });

  it('should expose a blocking error when initial request fails', async () => {
    const request = httpTesting.expectOne(PRODUCTS_URL);

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
    const initialRequest = httpTesting.expectOne(PRODUCTS_URL);

    initialRequest.flush(createPagedResult(MOCK_API_PRODUCTS));

    await applicationRef.whenStable();

    const updatedApiProducts: ProductListItemDto[] = [
      ...MOCK_API_PRODUCTS,
      {
        id: APPLE_PRODUCT_ID,
        name: 'Apple Watch',
        category: 'Electronics',
        brand: 'Apple',
        price: 399,
        oldPrice: 450,
        rating: 4.9,
        reviews: 245,
        stock: 8,
        badge: 'New',
        image: '/images/watch.jpg',
      },
    ];

    const expectedUpdatedProducts: Product[] = [
      ...MOCK_PRODUCTS,
      {
        id: APPLE_PRODUCT_ID,
        name: 'Apple Watch',
        category: 'Electronics',
        brand: 'Apple',
        price: 399,
        oldPrice: 450,
        rating: 4.9,
        reviews: 245,
        stock: 8,
        badge: 'New',
        image: '/images/watch.jpg',
        images: ['/images/watch.jpg'],
        description: '',
        sku: '',
      },
    ];

    const reloadStarted = service.reloadProducts();

    expect(reloadStarted).toBe(true);

    /*
     * تشغيل الـ Effect المسؤولة عن إعادة التحميل.
     */
    TestBed.tick();

    const reloadRequest = httpTesting.expectOne(PRODUCTS_URL);

    expect(service.products()).toEqual(MOCK_PRODUCTS);
    expect(service.isReloading()).toBe(true);

    reloadRequest.flush(createPagedResult(updatedApiProducts));

    await applicationRef.whenStable();

    expect(service.products()).toEqual(expectedUpdatedProducts);
    expect(service.isReloading()).toBe(false);

    expect(service.getProductById(APPLE_PRODUCT_ID)).toEqual(expectedUpdatedProducts[2]);
  });
});
