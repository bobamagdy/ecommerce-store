import { provideZonelessChangeDetection } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { ProductSortSelect } from './product-sort-select';

describe('ProductSortSelect', () => {
  let fixture: ComponentFixture<ProductSortSelect>;

  let component: ProductSortSelect;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSortSelect],

      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSortSelect);

    component = fixture.componentInstance;

    fixture.componentRef.setInput('value', 'newest');

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the selected sort label', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.textContent).toContain('Newest First');
  });

  it('should expose all sorting options', () => {
    expect(component.options).toHaveLength(4);

    expect(component.options.map((option) => option.value)).toEqual([
      'newest',
      'price-low',
      'price-high',
      'rating',
    ]);
  });

  it('should emit the committed sort option', () => {
    let emittedValue: string | undefined;

    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    component.selectedValues.set(['price-low']);

    component.popupExpanded.set(true);

    component.commitSelection();

    expect(emittedValue).toBe('price-low');

    expect(component.popupExpanded()).toBe(false);
  });

  it('should close the popup', () => {
    component.popupExpanded.set(true);

    component.closePopup();

    expect(component.popupExpanded()).toBe(false);
  });
});
