import { provideZonelessChangeDetection } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { Product } from '../../../core/models/product.model';

import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let fixture: ComponentFixture<ProductCard>;

  let component: ProductCard;

  const product: Product = {
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],

      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);

    component = fixture.componentInstance;

    fixture.componentRef.setInput('product', product);

    await fixture.whenStable();
  });

  it('should create the product card', () => {
    expect(component).toBeTruthy();
  });

  it('should display product information', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    const productName = hostElement.querySelector('h3');

    const productCategory = hostElement.querySelector('.product-category');

    const productImage = hostElement.querySelector('img') as HTMLImageElement;

    expect(productName?.textContent?.trim()).toBe('Sony Wireless Headphones');

    expect(productCategory?.textContent?.trim()).toBe('Electronics');

    expect(productImage.getAttribute('src')).toBe('/images/headphones.jpg');

    expect(productImage.getAttribute('alt')).toBe('Sony Wireless Headphones');
  });

  it('should display the calculated discount', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    const discount = hostElement.querySelector('.discount-percentage');

    expect(discount?.textContent?.trim()).toBe('25% OFF');
  });

  it('should emit true when adding a non-favorite product to wishlist', () => {
    let emittedValue: boolean | undefined;

    component.favoriteChange.subscribe((value) => {
      emittedValue = value;
    });

    const hostElement: HTMLElement = fixture.nativeElement;

    const favoriteButton = hostElement.querySelector('.favorite-button') as HTMLButtonElement;

    favoriteButton.click();

    expect(emittedValue).toBe(true);
  });

  it('should emit false when removing a favorite product from wishlist', async () => {
    fixture.componentRef.setInput('favorite', true);

    await fixture.whenStable();

    let emittedValue: boolean | undefined;

    component.favoriteChange.subscribe((value) => {
      emittedValue = value;
    });

    const hostElement: HTMLElement = fixture.nativeElement;

    const favoriteButton = hostElement.querySelector('.favorite-button') as HTMLButtonElement;

    favoriteButton.click();

    expect(emittedValue).toBe(false);
  });

  it('should set quantity to one and emit quantity change when add to cart is clicked', async () => {
    const emittedQuantities: number[] = [];

    component.quantity.subscribe((quantity) => {
      emittedQuantities.push(quantity);
    });

    const hostElement: HTMLElement = fixture.nativeElement;

    const addButton = hostElement.querySelector('.add-cart-button') as HTMLButtonElement;

    addButton.click();

    await fixture.whenStable();

    expect(component.quantity()).toBe(1);

    expect(emittedQuantities).toEqual([1]);

    expect(hostElement.querySelector('app-quantity-selector')).not.toBeNull();
  });

  it('should display quantity selector when product is already in cart', async () => {
    fixture.componentRef.setInput('quantity', 3);

    await fixture.whenStable();

    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.querySelector('.add-cart-button')).toBeNull();

    expect(hostElement.querySelector('app-quantity-selector')).not.toBeNull();

    expect(component.quantity()).toBe(3);
  });

  it('should display a disabled button when product is out of stock', async () => {
    fixture.componentRef.setInput('product', {
      ...product,
      stock: 0,
    });

    await fixture.whenStable();

    const hostElement: HTMLElement = fixture.nativeElement;

    const outOfStockButton = hostElement.querySelector('.out-of-stock-button') as HTMLButtonElement;

    expect(outOfStockButton).not.toBeNull();

    expect(outOfStockButton.disabled).toBe(true);

    expect(outOfStockButton.textContent?.trim()).toContain('Out of Stock');

    expect(hostElement.querySelector('.add-cart-button')).toBeNull();
  });

  it('should use list layout when layout input is list', async () => {
    fixture.componentRef.setInput('layout', 'list');

    await fixture.whenStable();

    const hostElement: HTMLElement = fixture.nativeElement;

    const productCard = hostElement.querySelector('.product-card');

    expect(productCard?.classList.contains('list-card')).toBe(true);
  });
});
