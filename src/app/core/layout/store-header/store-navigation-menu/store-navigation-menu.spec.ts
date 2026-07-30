import { provideZonelessChangeDetection } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter, Router } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StoreNavigationMenu } from './store-navigation-menu';

describe('StoreNavigationMenu', () => {
  let fixture: ComponentFixture<StoreNavigationMenu>;

  let component: StoreNavigationMenu;

  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreNavigationMenu],

      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreNavigationMenu);

    component = fixture.componentInstance;

    router = TestBed.inject(Router);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render shop and category triggers', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    const shopTrigger = hostElement.querySelector('[data-testid="shop-menu-trigger"]');

    const categoriesTrigger = hostElement.querySelector('[data-testid="categories-menu-trigger"]');

    expect(shopTrigger).not.toBeNull();

    expect(categoriesTrigger).not.toBeNull();
  });

  it('should expose four shop options', () => {
    expect(component.shopItems).toHaveLength(4);
  });

  it('should expose five categories', () => {
    expect(component.categoryItems).toHaveLength(5);
  });

  it('should navigate to all products', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.onShopItemSelected('all');

    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });

  it('should navigate to top-rated products', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.onShopItemSelected('rating');

    expect(navigateSpy).toHaveBeenCalledWith(['/products'], {
      queryParams: {
        sort: 'rating',
      },
    });
  });

  it('should navigate to lower-price products', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.onShopItemSelected('price-low');

    expect(navigateSpy).toHaveBeenCalledWith(['/products'], {
      queryParams: {
        sort: 'price-low',
      },
    });
  });

  it('should navigate to the selected category', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.onCategoryItemSelected('Electronics');

    expect(navigateSpy).toHaveBeenCalledWith(['/products'], {
      queryParams: {
        category: 'Electronics',
      },
    });
  });
});
