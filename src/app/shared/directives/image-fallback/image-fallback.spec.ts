import { Component, DebugElement, provideZonelessChangeDetection } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { beforeEach, describe, expect, it } from 'vitest';

import { ImageFallback } from './image-fallback';

@Component({
  selector: 'app-image-fallback-test-host',

  imports: [ImageFallback],

  template: `
    <img
      id="product-image"
      src="/images/broken-product.jpg"
      srcset="/images/broken-small.jpg 400w"
      sizes="400px"
      alt="Test product"
      appImageFallback="/images/product-placeholder.svg"
    />
  `,
})
class ImageFallbackTestHost {}

describe('ImageFallback', () => {
  let fixture: ComponentFixture<ImageFallbackTestHost>;

  let image: HTMLImageElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageFallbackTestHost],

      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageFallbackTestHost);

    fixture.detectChanges();

    image = fixture.nativeElement.querySelector('#product-image') as HTMLImageElement;
  });

  it('should create the test host', () => {
    expect(fixture.componentInstance).toBeTruthy();

    expect(image).toBeTruthy();
  });

  it('should attach the directive to the image', () => {
    const directiveElement: DebugElement | null = fixture.debugElement.query(
      By.directive(ImageFallback),
    );

    expect(directiveElement).not.toBeNull();
  });

  it('should replace a broken image with the fallback image', () => {
    image.dispatchEvent(new Event('error'));

    fixture.detectChanges();

    expect(image.getAttribute('src')).toBe('/images/product-placeholder.svg');

    expect(image.getAttribute('data-fallback-active')).toBe('true');

    expect(image.getAttribute('data-fallback-failed')).toBeNull();
  });

  it('should remove srcset and sizes when using the fallback', () => {
    expect(image.getAttribute('srcset')).not.toBeNull();

    expect(image.getAttribute('sizes')).not.toBeNull();

    image.dispatchEvent(new Event('error'));

    fixture.detectChanges();

    expect(image.getAttribute('srcset')).toBeNull();

    expect(image.getAttribute('sizes')).toBeNull();
  });

  it('should mark the image when the fallback image also fails', () => {
    /*
     * الخطأ الأول:
     * يتم استخدام صورة الـFallback.
     */
    image.dispatchEvent(new Event('error'));

    fixture.detectChanges();

    /*
     * الخطأ الثاني:
     * صورة الـFallback نفسها فشلت.
     */
    image.dispatchEvent(new Event('error'));

    fixture.detectChanges();

    expect(image.getAttribute('data-fallback-active')).toBe('true');

    expect(image.getAttribute('data-fallback-failed')).toBe('true');

    expect(image.getAttribute('aria-label')).toBe('Product image is unavailable');
  });

  it('should clear the fallback state when the original image loads', () => {
    image.dispatchEvent(new Event('error'));

    fixture.detectChanges();

    image.dispatchEvent(new Event('error'));

    fixture.detectChanges();

    image.setAttribute('src', '/images/working-product.jpg');

    image.dispatchEvent(new Event('load'));

    fixture.detectChanges();

    expect(image.getAttribute('data-fallback-active')).toBeNull();

    expect(image.getAttribute('data-fallback-failed')).toBeNull();

    expect(image.getAttribute('aria-label')).toBeNull();
  });
});
