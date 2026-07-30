import { provideZonelessChangeDetection, signal } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { Product } from '../../../core/models/product.model';

import { ProductService } from '../../../core/services/product/product';

import { ProductSearchAutocomplete } from './product-search-autocomplete';

describe('ProductSearchAutocomplete', () => {
  let fixture: ComponentFixture<ProductSearchAutocomplete>;

  let component: ProductSearchAutocomplete;

  const products: Product[] = [ 
    {
      id: 1,
      name: 'Sony Wireless Headphones',
      category: 'Electronics',
      brand: 'Sony',
      price: 149.99,
      oldPrice: 199.99,
      rating: 4.8,
      reviews: 320,
      badge: 'Sale',
      image: '/images/headphones.jpg',
      images: ['/images/headphones.jpg'],
      description: 'Wireless headphones.',
      stock: 10,
      sku: 'SONY-001',
    },
    {
      id: 2,
      name: 'Apple Smart Watch',
      category: 'Wearables',
      brand: 'Apple',
      price: 299.99,
      rating: 4.7,
      reviews: 220,
      image: '/images/watch.jpg',
      images: ['/images/watch.jpg'],
      description: 'Smart watch.',
      stock: 8,
      sku: 'APPLE-002',
    },
  ];

  const productServiceMock = {
    products: signal(products),

    isInitialLoading: signal(false),

    hasBlockingError: signal(false),

    errorMessage: signal(''),

    getProductById: (productId: number): Product | undefined => {
      return products.find((product) => product.id === productId);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSearchAutocomplete],

      providers: [
        provideZonelessChangeDetection(),

        {
          provide: ProductService,
          useValue: productServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchAutocomplete);

    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create the product search', () => {
    expect(component).toBeTruthy();
  });

  it('should filter products by name', () => {
    component.query.set('sony');

    expect(component.filteredProducts()).toEqual([products[0]]);
  });

  it('should filter products by brand', () => {
    component.query.set('apple');

    expect(component.filteredProducts()).toEqual([products[1]]);
  });

  it('should emit the normalized search query', () => {
    let emittedQuery: string | undefined;

    component.searchSubmitted.subscribe((query) => {
      emittedQuery = query;
    });

    component.query.set('  headphones  ');

    component.submitSearch();

    expect(emittedQuery).toBe('headphones');

    expect(component.popupExpanded()).toBe(false);
  });

  it('should clear the search value', () => {
    let cleared = false;

    component.cleared.subscribe(() => {
      cleared = true;
    });

    component.query.set('sony');

    component.popupExpanded.set(true);

    component.clearSearch();

    expect(component.query()).toBe('');

    expect(component.popupExpanded()).toBe(false);

    expect(cleared).toBe(true);
  });

  it('should emit the selected product', () => {
    let emittedProduct: Product | undefined;

    component.productSelected.subscribe((product) => {
      emittedProduct = product;
    });

    component.selectedProductIds.set([1]);

    component.commitSelection();

    expect(emittedProduct).toEqual(products[0]);

    expect(component.popupExpanded()).toBe(false);
  });
});
