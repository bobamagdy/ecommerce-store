import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { QuantitySelector } from './quantity-selector';

describe('QuantitySelector', () => {
  let fixture: ComponentFixture<QuantitySelector>;
  let component: QuantitySelector;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantitySelector],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantitySelector);

    component = fixture.componentInstance;

    fixture.componentRef.setInput('quantity', 2);
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 5);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the supplied input values', () => {
    expect(component.quantity()).toBe(2);
    expect(component.min()).toBe(0);
    expect(component.max()).toBe(5);
    expect(component.label()).toBe('In Cart');
  });

  it('should allow decreasing when quantity is greater than min', () => {
    expect(component.canDecrease()).toBe(true);
  });

  it('should prevent decreasing when quantity equals min', () => {
    component.quantity.set(0);

    expect(component.canDecrease()).toBe(false);

    component.decrease();

    expect(component.quantity()).toBe(0);
  });

  it('should decrease quantity by one', () => {
    component.decrease();

    expect(component.quantity()).toBe(1);
  });

  it('should not decrease quantity below min', () => {
    component.quantity.set(1);

    component.decrease();
    component.decrease();

    expect(component.quantity()).toBe(0);
  });

  it('should allow increasing when quantity is less than max', () => {
    expect(component.canIncrease()).toBe(true);
  });

  it('should prevent increasing when quantity equals max', () => {
    component.quantity.set(5);

    expect(component.canIncrease()).toBe(false);

    component.increase();

    expect(component.quantity()).toBe(5);
  });

  it('should increase quantity by one', () => {
    component.increase();

    expect(component.quantity()).toBe(3);
  });

  it('should not increase quantity above max', () => {
    component.quantity.set(4);

    component.increase();
    component.increase();

    expect(component.quantity()).toBe(5);
  });

  it('should display the trash icon before reaching min', () => {
    component.quantity.set(1);

    expect(component.decreaseIcon()).toBe('pi-trash');
  });

  it('should display the minus icon when quantity is above min plus one', () => {
    component.quantity.set(2);

    expect(component.decreaseIcon()).toBe('pi-minus');
  });

  it('should support a custom minimum value', () => {
    fixture.componentRef.setInput('min', 2);

    component.quantity.set(3);

    expect(component.decreaseIcon()).toBe('pi-trash');

    component.decrease();

    expect(component.quantity()).toBe(2);
    expect(component.canDecrease()).toBe(false);
  });
});
