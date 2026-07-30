import { provideZonelessChangeDetection } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductsView } from '../../../core/models/products-page.models';

import { ProductsToolbar } from './products-toolbar';

describe('ProductsToolbar', () => {
  let fixture: ComponentFixture<ProductsToolbar>;

  let component: ProductsToolbar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsToolbar],

      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsToolbar);

    component = fixture.componentInstance;

    fixture.componentRef.setInput('displayedCount', 8);

    fixture.componentRef.setInput('totalCount', 12);

    fixture.componentRef.setInput('sortBy', 'newest');

    fixture.componentRef.setInput('view', 'grid');

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product counts', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.textContent).toContain('Showing');

    expect(hostElement.textContent).toContain('8');

    expect(hostElement.textContent).toContain('12');

    expect(hostElement.textContent).toContain('products');
  });

  it('should select grid view initially', () => {
    expect(component.selectedViews()).toEqual(['grid']);
  });

  it('should emit list view when the selected value changes', () => {
    const emitSpy = vi.spyOn(component.viewChange, 'emit');

    component.onSelectedViewsChange(['list']);

    expect(component.selectedViews()).toEqual(['list']);

    expect(emitSpy).toHaveBeenCalledOnce();

    expect(emitSpy).toHaveBeenCalledWith('list');
  });

  it('should emit grid view when the selected value changes', () => {
    fixture.componentRef.setInput('view', 'list');

    const emitSpy = vi.spyOn(component.viewChange, 'emit');

    component.onSelectedViewsChange(['grid']);

    expect(component.selectedViews()).toEqual(['grid']);

    expect(emitSpy).toHaveBeenCalledOnce();

    expect(emitSpy).toHaveBeenCalledWith('grid');
  });

  it('should not emit when the selected view matches the current input', () => {
    const emitSpy = vi.spyOn(component.viewChange, 'emit');

    component.onSelectedViewsChange(['grid']);

    expect(component.selectedViews()).toEqual(['grid']);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should ignore an empty selection', () => {
    const emitSpy = vi.spyOn(component.viewChange, 'emit');

    component.onSelectedViewsChange([]);

    expect(component.selectedViews()).toEqual(['grid']);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should synchronize with a view input change', async () => {
    fixture.componentRef.setInput('view', 'list' satisfies ProductsView);

    await fixture.whenStable();

    expect(component.selectedViews()).toEqual(['list']);
  });

  it('should render the grid and list view buttons', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    const gridButton = hostElement.querySelector('[aria-label="Grid view"]');

    const listButton = hostElement.querySelector('[aria-label="List view"]');

    expect(gridButton).not.toBeNull();

    expect(listButton).not.toBeNull();
  });
});
