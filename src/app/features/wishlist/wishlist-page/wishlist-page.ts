import { CurrencyPipe } from '@angular/common';

import {
  Component,
  computed,
  inject
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart';
import { ProductService } from '../../../core/services/product';
import { WishlistService } from '../../../core/services/wishlist';

@Component({
  selector: 'app-wishlist-page',

  imports: [
    CurrencyPipe,
    RouterLink,
    ButtonModule
  ],

  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.scss'
})
export class WishlistPage {
  private readonly wishlistService =
    inject(WishlistService);

  private readonly productService =
    inject(ProductService);

  private readonly cartService =
    inject(CartService);

  readonly wishlistProducts = computed(() => {
    const favoriteProductIds =
      this.wishlistService.productIds();

    return this.productService
      .products()
      .filter((product) =>
        favoriteProductIds.includes(product.id)
      );
  });

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeProduct(productId);
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }

  getProductQuantity(productId: number): number {
    return this.cartService.getProductQuantity(productId);
  }

  increaseProductQuantity(product: Product): void {
    this.cartService.addProduct(product, 1);
  }

  decreaseProductQuantity(productId: number): void {
    this.cartService.decreaseOrRemoveProduct(productId);
  }
}