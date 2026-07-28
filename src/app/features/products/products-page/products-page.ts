import { CurrencyPipe } from '@angular/common';

import { Component, computed, inject, signal } from '@angular/core';

import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { WishlistService } from '../../../core/services/wishlist';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart';
import { ProductService } from '../../../core/services/product';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating';

interface FilterOption {
  name: string;
  count: number;
}

@Component({
  selector: 'app-products-page',

  imports: [CurrencyPipe, ButtonModule, CurrencyPipe, ButtonModule, RouterLink],

  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
private readonly wishlistService =
  inject(WishlistService);
  readonly products = this.productService.products;

  readonly categories: FilterOption[] = [
    { name: 'Electronics', count: 128 },
    { name: 'Fashion', count: 156 },
    { name: 'Beauty', count: 98 },
    { name: 'Home & Living', count: 112 },
    { name: 'Sports', count: 74 },
  ];

  readonly brands: FilterOption[] = [
    { name: 'Apple', count: 32 },
    { name: 'Sony', count: 28 },
    { name: 'Nike', count: 18 },
    { name: 'Adidas', count: 16 },
    { name: 'Philips', count: 14 },
    { name: 'Michael Kors', count: 10 },
    { name: 'Lancôme', count: 8 },
    { name: 'IKEA', count: 12 },
  ];

  readonly selectedCategories = signal<string[]>([]);
  readonly selectedBrands = signal<string[]>([]);

  readonly maxPrice = signal(600);

  readonly sortBy = signal<SortOption>('newest');

  readonly gridView = signal(true);


  readonly filteredProducts = computed(() => {
    const categories = this.selectedCategories();
    const brands = this.selectedBrands();
    const maximumPrice = this.maxPrice();
    const sorting = this.sortBy();

    const filteredItems = this.products().filter((product) => {
      const categoryMatches = categories.length === 0 || categories.includes(product.category);

      const brandMatches = brands.length === 0 || brands.includes(product.brand);

      const priceMatches = product.price <= maximumPrice;

      return categoryMatches && brandMatches && priceMatches;
    });

    return [...filteredItems].sort((firstProduct, secondProduct) => {
      switch (sorting) {
        case 'price-low':
          return firstProduct.price - secondProduct.price;

        case 'price-high':
          return secondProduct.price - firstProduct.price;

        case 'rating':
          return secondProduct.rating - firstProduct.rating;

        case 'newest':
        default:
          return secondProduct.id - firstProduct.id;
      }
    });
  });

  toggleCategory(categoryName: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    this.selectedCategories.update((selectedCategories) =>
      this.updateSelectedValues(selectedCategories, categoryName, checkbox.checked),
    );
  }

  toggleBrand(brandName: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    this.selectedBrands.update((selectedBrands) =>
      this.updateSelectedValues(selectedBrands, brandName, checkbox.checked),
    );
  }

  changeMaximumPrice(event: Event): void {
    const rangeInput = event.target as HTMLInputElement;

    this.maxPrice.set(Number(rangeInput.value));
  }

  changeSorting(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;

    this.sortBy.set(selectElement.value as SortOption);
  }

  showGridView(): void {
    this.gridView.set(true);
  }

  showListView(): void {
    this.gridView.set(false);
  }

  toggleFavorite(productId: number): void {
  this.wishlistService.toggleProduct(productId);
}

isFavorite(productId: number): boolean {
  return this.wishlistService.isFavorite(productId);
}

  addToCart(product: Product): void {
    this.cartService.addProduct(product);
  }

 
  resetFilters(): void {
    this.selectedCategories.set([]);
    this.selectedBrands.set([]);
    this.maxPrice.set(600);
    this.sortBy.set('newest');
  }

  private updateSelectedValues(currentValues: string[], value: string, checked: boolean): string[] {
    if (checked) {
      return currentValues.includes(value) ? currentValues : [...currentValues, value];
    }

    return currentValues.filter((currentValue) => currentValue !== value);
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
