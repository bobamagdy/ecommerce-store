import { httpResource } from '@angular/common/http';

import { computed, Injectable } from '@angular/core';

import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsResource = httpResource<Product[]>(() => '/data/products.json', {
    defaultValue: [],
  });

  /*
   * لا نقرأ value() أثناء Error State.
   */
  readonly products = computed<Product[]>(() =>
    this.productsResource.hasValue() ? this.productsResource.value() : [],
  );

  /*
   * Lookup جاهز حسب Product ID.
   *
   * يتكوّن من جديد فقط عندما تتغير
   * قائمة المنتجات.
   */
  private readonly productsById = computed(() => {
    return new Map<number, Product>(this.products().map((product) => [product.id, product]));
  });

  readonly isLoading = this.productsResource.isLoading;

  readonly error = this.productsResource.error;

  readonly status = this.productsResource.status;

  readonly statusCode = this.productsResource.statusCode;

  readonly isInitialLoading = computed(() => this.isLoading() && this.products().length === 0);

  readonly isReloading = computed(() => this.status() === 'reloading');

  readonly hasBlockingError = computed(
    () => this.error() !== undefined && this.products().length === 0,
  );

  readonly errorMessage = computed(() => {
    const currentError = this.error();

    if (!currentError) {
      return '';
    }

    return currentError.message || 'Products could not be loaded.';
  });

  getProductById(productId: number): Product | undefined {
    return this.productsById().get(productId);
  }

  reloadProducts(): boolean {
    return this.productsResource.reload();
  }
}
