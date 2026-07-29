import { CurrencyPipe } from '@angular/common';

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { RouterLink } from '@angular/router';

import { ProductService } from '../../../../core/services/product/product';

import { ImageFallback } from '../../../../shared/directives/image-fallback/image-fallback';

@Component({
  selector: 'app-admin-products',

  imports: [CurrencyPipe, RouterLink, ImageFallback],

  templateUrl: './admin-products.html',

  styleUrl: '../../admin-page.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProducts {
  private readonly productService = inject(ProductService);

  readonly products = this.productService.products;

  readonly searchQuery = signal('');

  readonly filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return this.products();
    }

    return this.products().filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query),
    );
  });

  updateSearch(event: Event): void {
    const inputElement = event.currentTarget as HTMLInputElement;

    this.searchQuery.set(inputElement.value);
  }
}
