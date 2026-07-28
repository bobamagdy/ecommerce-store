import {
  CurrencyPipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  ButtonModule
} from 'primeng/button';

import {
  Product
} from '../../../../core/models/product.model';

import {
  ImageFallback
} from '../../../../features/shared/directives/image-fallback';

import {
  QuantitySelector
} from '../quantity-selector/quantity-selector';

export type ProductCardLayout =
  | 'grid'
  | 'list';

@Component({
  selector: 'app-product-card',

  imports: [
    CurrencyPipe,
    RouterLink,
    ButtonModule,
    ImageFallback,
    QuantitySelector
  ],

  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ProductCard {
  /*
   * المنتج إجباري.
   */
  readonly product =
    input.required<Product>();

  /*
   * شكل الكارت:
   *
   * grid
   * list
   */
  readonly layout =
    input<ProductCardLayout>('grid');

  /*
   * هل المنتج موجود داخل Wishlist؟
   */
  readonly favorite =
    input(false);

  /*
   * Model Input:
   *
   * Input:
   * quantity
   *
   * Output:
   * quantityChange
   */
  readonly quantity =
    model(0);

  /*
   * Event للـParent عند تغيير حالة القلب.
   */
  readonly favoriteChange =
    output<boolean>();

  toggleFavorite(): void {
    this.favoriteChange.emit(
      !this.favorite()
    );
  }

  addToCart(): void {
    const currentProduct =
      this.product();

    if (
      currentProduct.stock <= 0 ||
      this.quantity() > 0
    ) {
      return;
    }

    this.quantity.set(1);
  }
}