import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { Product } from '../../../core/models/product.model';

import { CartService } from '../../../core/services/cart/cart';

import { ProductService } from '../../../core/services/product/product';

import { WishlistService } from '../../../core/services/wishlist/wishlist';

import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-wishlist-page',

  imports: [RouterLink, ButtonModule, ProductCard],

  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistPage {
  private readonly wishlistService = inject(WishlistService);

  private readonly productService = inject(ProductService);

  private readonly cartService = inject(CartService);

  /*
   * قائمة المنتجات المفضلة مشتقة من:
   *
   * جميع المنتجات
   * +
   * أرقام المنتجات المحفوظة في Wishlist.
   *
   * لذلك computed() هي الاختيار الصحيح.
   */
  readonly wishlistProducts = computed(() => {
    const favoriteProductIds = this.wishlistService.productIds();

    return this.productService
      .products()
      .filter((product) => favoriteProductIds.includes(product.id));
  });

  /*
   * العدد يظهر مباشرة في عنوان الصفحة.
   */
  readonly wishlistCount = computed(() => this.wishlistProducts().length);

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }

  setFavorite(productId: number, shouldBeFavorite: boolean): void {
    const currentlyFavorite = this.wishlistService.isFavorite(productId);

    /*
     * نتجنب تنفيذ Toggle لو الحالة
     * المطلوبة هي نفسها الحالة الحالية.
     */
    if (currentlyFavorite === shouldBeFavorite) {
      return;
    }

    this.wishlistService.toggleProduct(productId);
  }

  getProductQuantity(productId: number): number {
    return this.cartService.getProductQuantity(productId);
  }

  setProductQuantity(product: Product, quantity: number): void {
    this.cartService.setProductQuantity(product, quantity);
  }
}
