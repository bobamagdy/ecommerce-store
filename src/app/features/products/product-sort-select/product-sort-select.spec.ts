import { provideZonelessChangeDetection } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductSortSelect } from './product-sort-select';

describe('ProductSortSelect', () => {
  let fixture: ComponentFixture<ProductSortSelect>;

  let component: ProductSortSelect;

  beforeEach(async () => {
    HTMLElement.prototype.scrollIntoView = vi.fn();

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

  it('should ignore an invalid selection', () => {
    const emitSpy = vi.spyOn(component.valueChange, 'emit');

    component.selectedValues.set([]);

    component.popupExpanded.set(true);

    component.commitSelection();

    expect(emitSpy).not.toHaveBeenCalled();

    expect(component.popupExpanded()).toBe(true);
  });

  it('should render the popup options when expanded', async () => {
    component.popupExpanded.set(true);

    await fixture.whenStable();

    const options = document.body.querySelectorAll('.sort-option');

    expect(options).toHaveLength(4);

    component.popupExpanded.set(false);

    await fixture.whenStable();
  });

  it('should commit the selected option when an option is clicked', async () => {
    const emitSpy = vi.spyOn(component.valueChange, 'emit');

    component.popupExpanded.set(true);

    await fixture.whenStable();

    const optionsList = document.body.querySelector('.sort-options-list') as HTMLElement;

    optionsList.click();

    await fixture.whenStable();

    expect(emitSpy).toHaveBeenCalledWith('newest');

    expect(component.popupExpanded()).toBe(false);
  });
});
