import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
@Component({
  selector: 'app-store-header',
  imports: [ButtonModule, InputTextModule, RouterLink, RouterLinkActive],
  templateUrl: './store-header.html',
  styleUrl: './store-header.scss',
})
export class StoreHeader {
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  readonly wishlistCount = this.wishlistService.totalItems;
  readonly cartCount = this.cartService.totalQuantity;
}
