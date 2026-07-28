import { CurrencyPipe } from '@angular/common';

import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';

import { map } from 'rxjs';

import { ButtonModule } from 'primeng/button';

import { CartService } from '../../../core/services/cart';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-product-details-page',

  imports: [
    CurrencyPipe,
    RouterLink,
    ButtonModule
  ],

  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.scss'
})
export class ProductDetailsPage {
  private readonly route = inject(ActivatedRoute);

  private readonly productService =
    inject(ProductService);

  private readonly cartService =
    inject(CartService);

  readonly productId = toSignal(
    this.route.paramMap.pipe(
      map((parameters) =>
        Number(parameters.get('id'))
      )
    ),
    {
      initialValue:
        Number(
          this.route.snapshot.paramMap.get('id')
        ) || 0
    }
  );

  readonly product = computed(() =>
    this.productService.getProductById(
      this.productId()
    )
  );

  readonly selectedImage = linkedSignal(
    () => this.product()?.image ?? ''
  );

  readonly quantity = signal(1);

  readonly addedToCart = signal(false);

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  increaseQuantity(): void {
    const product = this.product();

    if (!product) {
      return;
    }

    this.quantity.update((currentQuantity) =>
      Math.min(
        currentQuantity + 1,
        product.stock
      )
    );
  }

  decreaseQuantity(): void {
    this.quantity.update((currentQuantity) =>
      Math.max(currentQuantity - 1, 1)
    );
  }

  addToCart(): void {
    const product = this.product();

    if (!product) {
      return;
    }

    this.cartService.addProduct(
      product,
      this.quantity()
    );

    this.addedToCart.set(true);
  }
}