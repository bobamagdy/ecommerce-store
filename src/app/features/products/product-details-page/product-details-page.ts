import { CurrencyPipe } from '@angular/common';

import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  viewChildren,
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { CartService } from '../../../core/services/cart/cart';

import { ProductService } from '../../../core/services/product/product';

import { WishlistService } from '../../../core/services/wishlist/wishlist';

import { QuantitySelector } from '../../../shared/components/quantity-selector/quantity-selector';

import { ImageFallback } from '../../../shared/directives/image-fallback/image-fallback';

function transformProductId(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

@Component({
  selector: 'app-product-details-page',

  imports: [CurrencyPipe, RouterLink, ButtonModule, QuantitySelector, ImageFallback],

  templateUrl: './product-details-page.html',

  styleUrl: './product-details-page.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsPage {
  private readonly productService = inject(ProductService);

  private readonly cartService = inject(CartService);

  private readonly wishlistService = inject(WishlistService);

  /*
   * Router Signal Input.
   *
   * Angular Router يربطها مع:
   * products/:id
   */
  readonly id = input.required<string, string | null | undefined>({
    transform: transformProductId,
  });

  /*
   * Signal Query.
   *
   * تجمع كل العناصر التي تحمل:
   * #thumbnailButton
   *
   * وتتحدث تلقائيًا إذا تغير عدد الصور.
   */
  readonly thumbnailButtons = viewChildren<ElementRef<HTMLButtonElement>>('thumbnailButton');

  readonly product = computed(() => this.productService.getProductById(this.id()));

  readonly selectedImage = linkedSignal(() => this.product()?.image ?? '');

  /*
   * Index الصورة المختارة حاليًا.
   */
  readonly selectedImageIndex = computed(() => {
    const currentProduct = this.product();

    if (!currentProduct) {
      return -1;
    }

    return currentProduct.images.indexOf(this.selectedImage());
  });

  readonly cartQuantity = computed(() => {
    const currentProduct = this.product();

    if (!currentProduct) {
      return 0;
    }

    return this.cartService.getProductQuantity(currentProduct.id);
  });

  readonly quantity = linkedSignal<number>(() => {
    const currentProduct = this.product();

    if (!currentProduct || currentProduct.stock <= 0) {
      return 0;
    }

    const currentCartQuantity = this.cartQuantity();

    return currentCartQuantity > 0 ? currentCartQuantity : 1;
  });

  readonly isInCart = computed(() => this.cartQuantity() > 0);

  readonly isFavorite = computed(() => {
    const currentProduct = this.product();

    if (!currentProduct) {
      return false;
    }

    return this.wishlistService.isFavorite(currentProduct.id);
  });

  constructor() {
    /*
     * بعد انتهاء Angular من الـRender:
     *
     * نضمن أن زر الصورة المختارة ظاهر
     * داخل منطقة الصور المصغرة.
     *
     * الـEffect يتابع:
     * selectedImageIndex()
     * thumbnailButtons()
     */
    afterRenderEffect({
      write: () => {
        const selectedIndex = this.selectedImageIndex();

        if (selectedIndex < 0) {
          return;
        }

        const selectedButton = this.thumbnailButtons()[selectedIndex]?.nativeElement;

        selectedButton?.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
        });
      },
    });
  }

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  handleThumbnailKeydown(event: KeyboardEvent, currentIndex: number): void {
    const images = this.product()?.images ?? [];

    if (images.length === 0) {
      return;
    }

    let targetIndex: number;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        targetIndex = (currentIndex + 1) % images.length;
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        targetIndex = (currentIndex - 1 + images.length) % images.length;
        break;

      case 'Home':
        targetIndex = 0;
        break;

      case 'End':
        targetIndex = images.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();

    this.selectImageAtIndex(targetIndex, true);
  }

  setSelectedQuantity(quantity: number): void {
    this.quantity.set(quantity);
  }

  saveCartQuantity(): void {
    const currentProduct = this.product();

    const selectedQuantity = this.quantity();

    if (!currentProduct || currentProduct.stock <= 0 || selectedQuantity <= 0) {
      return;
    }

    this.cartService.setProductQuantity(currentProduct, selectedQuantity);
  }

  toggleFavorite(): void {
    const currentProduct = this.product();

    if (!currentProduct) {
      return;
    }

    this.wishlistService.toggleProduct(currentProduct.id);
  }

  private selectImageAtIndex(requestedIndex: number, shouldFocus: boolean): void {
    const images = this.product()?.images ?? [];

    if (images.length === 0) {
      return;
    }

    const safeIndex = Math.min(Math.max(requestedIndex, 0), images.length - 1);

    this.selectedImage.set(images[safeIndex]);

    if (!shouldFocus) {
      return;
    }

    this.thumbnailButtons()[safeIndex]?.nativeElement.focus();
  }
}
