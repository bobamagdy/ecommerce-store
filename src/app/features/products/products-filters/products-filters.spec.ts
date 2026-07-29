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
});
