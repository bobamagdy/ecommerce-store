import { provideZonelessChangeDetection } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

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

  it('should display product counts', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.textContent).toContain('8');

    expect(hostElement.textContent).toContain('12');
  });

  it('should emit list view', () => {
    let emittedView: string | undefined;

    component.viewChange.subscribe((view) => {
      emittedView = view;
    });

    const listButton = fixture.nativeElement.querySelector(
      '[aria-label="List view"]',
    ) as HTMLButtonElement;

    listButton.click();

    expect(emittedView).toBe('list');
  });
});
