import { CurrencyPipe } from '@angular/common';

import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { Product } from '../../../core/models/product.model';

import { ImageFallback } from '../../directives/image-fallback/image-fallback';
import { DiscountPercentagePipe } from '../../pipes/discount-percentage/discount-percentage-pipe';

import { QuantitySelector } from '../quantity-selector/quantity-selector';

export type ProductCardLayout = 'grid' | 'list';

@Component({
  selector: 'app-product-card',

  imports: [
    CurrencyPipe,
    RouterLink,
    ButtonModule,
    ImageFallback,
    DiscountPercentagePipe,
    QuantitySelector,
  ],

  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  /*
   * Required Signal Input.
   */
  readonly product = input.required<Product>();

  /*
   * شكل عرض الكارت.
   */
  readonly layout = input<ProductCardLayout>('grid');

  /*
   * حالة المنتج داخل الـWishlist.
   */
  readonly favorite = input(false);

  /*
   * Model Signal:
   *
   * Input: quantity
   * Output: quantityChange
   */
  readonly quantity = model(0);

  /*
   * Event يتم إرساله للـParent عند
   * تغيير حالة القلب.
   */
  readonly favoriteChange = output<boolean>();

  toggleFavorite(): void {
    this.favoriteChange.emit(!this.favorite());
  }

  addToCart(): void {
    const currentProduct = this.product();

    if (currentProduct.stock <= 0 || this.quantity() > 0) {
      return;
    }

    this.quantity.set(1);
  }
}
