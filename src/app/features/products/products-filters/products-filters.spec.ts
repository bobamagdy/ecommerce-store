import { provideZonelessChangeDetection } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { FilterOption } from '../../../core/models/products-page.models';

import { ProductsFilters } from './products-filters';

describe('ProductsFilters', () => {
  let fixture: ComponentFixture<ProductsFilters>;

  let component: ProductsFilters;

  const categories: FilterOption[] = [
    {
      name: 'Electronics',
      count: 10,
    },
  ];

  const brands: FilterOption[] = [
    {
      name: 'Sony',
      count: 5,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsFilters],

      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsFilters);

    component = fixture.componentInstance;

    fixture.componentRef.setInput('categories', categories);

    fixture.componentRef.setInput('brands', brands);

    fixture.componentRef.setInput('selectedCategories', []);

    fixture.componentRef.setInput('selectedBrands', []);

    fixture.componentRef.setInput('searchQuery', '');

    fixture.componentRef.setInput('maxPrice', 600);

    fixture.componentRef.setInput('hasActiveFilters', false);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render categories and brands', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.textContent).toContain('Electronics');

    expect(hostElement.textContent).toContain('Sony');
  });

  it('should initially expand the functional filters', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    const triggers = hostElement.querySelectorAll('.filter-trigger');

    expect(triggers).toHaveLength(3);

    for (const trigger of triggers) {
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    }
  });

  it('should collapse the category filter', async () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    const categoryTrigger = hostElement.querySelector(
      '[data-testid="categories-filter-trigger"]',
    ) as HTMLButtonElement;

    categoryTrigger.click();

    await fixture.whenStable();

    expect(categoryTrigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should reopen the category filter', async () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    const categoryTrigger = hostElement.querySelector(
      '[data-testid="categories-filter-trigger"]',
    ) as HTMLButtonElement;

    categoryTrigger.click();

    await fixture.whenStable();

    categoryTrigger.click();

    await fixture.whenStable();

    expect(categoryTrigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('should emit a category selection', () => {
    let emittedValue: unknown;

    component.categoryChange.subscribe((value) => {
      emittedValue = value;
    });

    const checkbox = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    checkbox.checked = true;

    checkbox.dispatchEvent(new Event('change'));

    expect(emittedValue).toEqual({
      value: 'Electronics',
      checked: true,
    });
  });

  it('should emit a brand selection', () => {
    let emittedValue: unknown;

    component.brandChange.subscribe((value) => {
      emittedValue = value;
    });

    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');

    const brandCheckbox = checkboxes[1] as HTMLInputElement;

    brandCheckbox.checked = true;

    brandCheckbox.dispatchEvent(new Event('change'));

    expect(emittedValue).toEqual({
      value: 'Sony',
      checked: true,
    });
  });

  it('should emit the maximum price', () => {
    let emittedPrice: number | undefined;

    component.maxPriceChange.subscribe((price) => {
      emittedPrice = price;
    });

    const rangeInput = fixture.nativeElement.querySelector(
      'input[type="range"]',
    ) as HTMLInputElement;

    rangeInput.value = '350';

    rangeInput.dispatchEvent(new Event('input'));

    expect(emittedPrice).toBe(350);
  });

  it('should mark unavailable filters as disabled', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    const unavailableFilters = hostElement.querySelectorAll('.future-filter[aria-disabled="true"]');

    expect(unavailableFilters).toHaveLength(3);
  });
});
