import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import {
  CartItem,
  CartService
} from '../../../core/services/cart';

@Component({
  selector: 'app-cart-page',

  imports: [
    CurrencyPipe,
    RouterLink,
    ButtonModule
  ],

  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss'
})
export class CartPage {
  private readonly cartService =
    inject(CartService);

  readonly cartItems =
    this.cartService.items;

  readonly subtotal =
    this.cartService.subtotal;

  readonly shipping =
    this.cartService.shipping;

  readonly tax =
    this.cartService.tax;

  readonly total =
    this.cartService.total;

  increaseQuantity(item: CartItem): void {
    this.cartService.increaseQuantity(
      item.product.id
    );
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.decreaseQuantity(
      item.product.id
    );
  }

  removeProduct(productId: number): void {
    this.cartService.removeProduct(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}