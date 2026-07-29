import { beforeEach, describe, expect, it } from 'vitest';

import { DiscountPercentagePipe } from './discount-percentage-pipe';

describe('DiscountPercentagePipe', () => {
  let pipe: DiscountPercentagePipe;

  beforeEach(() => {
    pipe = new DiscountPercentagePipe();
  });

  it('should create the pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should calculate the discount percentage', () => {
    const result = pipe.transform(150, 200);

    expect(result).toBe(25);
  });

  it('should round the discount percentage', () => {
    const result = pipe.transform(79.99, 100);

    expect(result).toBe(20);
  });

  it('should return null when current price equals old price', () => {
    const result = pipe.transform(100, 100);

    expect(result).toBeNull();
  });

  it('should return null when current price is greater than old price', () => {
    const result = pipe.transform(150, 100);

    expect(result).toBeNull();
  });

  it('should return null when old price is zero', () => {
    const result = pipe.transform(50, 0);

    expect(result).toBeNull();
  });

  it('should return null when current price is negative', () => {
    const result = pipe.transform(-50, 100);

    expect(result).toBeNull();
  });

  it('should return null when a value is missing', () => {
    expect(pipe.transform(undefined, 100)).toBeNull();

    expect(pipe.transform(80, undefined)).toBeNull();

    expect(pipe.transform(null, 100)).toBeNull();
  });

  it('should return null for non-finite numbers', () => {
    expect(pipe.transform(Number.NaN, 100)).toBeNull();

    expect(pipe.transform(50, Number.POSITIVE_INFINITY)).toBeNull();
  });
});
