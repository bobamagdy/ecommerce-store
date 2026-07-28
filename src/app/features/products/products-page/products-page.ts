import {
  CurrencyPipe
} from '@angular/common';

import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  ButtonModule
} from 'primeng/button';

import {
  Product
} from '../../../core/models/product.model';

import {
  CartService
} from '../../../core/services/cart';

import {
  ProductService
} from '../../../core/services/product';

import {
  WishlistService
} from '../../../core/services/wishlist';

import {
  ProductCard
} from '../../shared/components/product-card/product-card';

type SortOption =
  | 'newest'
  | 'price-low'
  | 'price-high'
  | 'rating';

interface FilterOption {
  name: string;
  count: number;
}

@Component({
  selector: 'app-products-page',

  imports: [
    CurrencyPipe,
    ButtonModule,
    ProductCard
  ],

  templateUrl: './products-page.html',
  styleUrl: './products-page.scss'
})
export class ProductsPage {
  private readonly productService =
    inject(ProductService);

  private readonly cartService =
    inject(CartService);

  private readonly wishlistService =
    inject(WishlistService);

  readonly products =
    this.productService.products;

  readonly categories:
    FilterOption[] = [
      {
        name: 'Electronics',
        count: 128
      },
      {
        name: 'Fashion',
        count: 156
      },
      {
        name: 'Beauty',
        count: 98
      },
      {
        name: 'Home & Living',
        count: 112
      },
      {
        name: 'Sports',
        count: 74
      }
    ];

  readonly brands:
    FilterOption[] = [
      {
        name: 'Apple',
        count: 32
      },
      {
        name: 'Sony',
        count: 28
      },
      {
        name: 'Nike',
        count: 18
      },
      {
        name: 'Adidas',
        count: 16
      },
      {
        name: 'Philips',
        count: 14
      },
      {
        name: 'Michael Kors',
        count: 10
      },
      {
        name: 'Lancôme',
        count: 8
      },
      {
        name: 'IKEA',
        count: 12
      }
    ];

  readonly selectedCategories =
    signal<string[]>([]);

  readonly selectedBrands =
    signal<string[]>([]);

  readonly maxPrice =
    signal(600);

  readonly sortBy =
    signal<SortOption>('newest');

  readonly gridView =
    signal(true);

  readonly filteredProducts =
    computed(() => {
      const selectedCategories =
        this.selectedCategories();

      const selectedBrands =
        this.selectedBrands();

      const maximumPrice =
        this.maxPrice();

      const selectedSorting =
        this.sortBy();

      const filteredItems =
        this.products().filter(
          (product) => {
            const categoryMatches =
              selectedCategories.length === 0 ||
              selectedCategories.includes(
                product.category
              );

            const brandMatches =
              selectedBrands.length === 0 ||
              selectedBrands.includes(
                product.brand
              );

            const priceMatches =
              product.price <=
              maximumPrice;

            return (
              categoryMatches &&
              brandMatches &&
              priceMatches
            );
          }
        );

      return [...filteredItems].sort(
        (
          firstProduct,
          secondProduct
        ) => {
          switch (selectedSorting) {
            case 'price-low':
              return (
                firstProduct.price -
                secondProduct.price
              );

            case 'price-high':
              return (
                secondProduct.price -
                firstProduct.price
              );

            case 'rating':
              return (
                secondProduct.rating -
                firstProduct.rating
              );

            case 'newest':
            default:
              return (
                secondProduct.id -
                firstProduct.id
              );
          }
        }
      );
    });

  toggleCategory(
    categoryName: string,
    event: Event
  ): void {
    const checkbox =
      event.target as HTMLInputElement;

    this.selectedCategories.update(
      (selectedCategories) =>
        this.updateSelectedValues(
          selectedCategories,
          categoryName,
          checkbox.checked
        )
    );
  }

  toggleBrand(
    brandName: string,
    event: Event
  ): void {
    const checkbox =
      event.target as HTMLInputElement;

    this.selectedBrands.update(
      (selectedBrands) =>
        this.updateSelectedValues(
          selectedBrands,
          brandName,
          checkbox.checked
        )
    );
  }

  changeMaximumPrice(
    event: Event
  ): void {
    const rangeInput =
      event.target as HTMLInputElement;

    this.maxPrice.set(
      Number(rangeInput.value)
    );
  }

  changeSorting(
    event: Event
  ): void {
    const selectElement =
      event.target as HTMLSelectElement;

    this.sortBy.set(
      selectElement.value as SortOption
    );
  }

  showGridView(): void {
    this.gridView.set(true);
  }

  showListView(): void {
    this.gridView.set(false);
  }

  isFavorite(
    productId: number
  ): boolean {
    return this.wishlistService
      .isFavorite(productId);
  }

  setFavorite(
    productId: number,
    shouldBeFavorite: boolean
  ): void {
    const currentlyFavorite =
      this.wishlistService
        .isFavorite(productId);

    if (
      currentlyFavorite ===
      shouldBeFavorite
    ) {
      return;
    }

    this.wishlistService
      .toggleProduct(productId);
  }

  getProductQuantity(
    productId: number
  ): number {
    return this.cartService
      .getProductQuantity(productId);
  }

  setProductQuantity(
    product: Product,
    quantity: number
  ): void {
    this.cartService
      .setProductQuantity(
        product,
        quantity
      );
  }

  resetFilters(): void {
    this.selectedCategories.set([]);
    this.selectedBrands.set([]);
    this.maxPrice.set(600);
    this.sortBy.set('newest');
  }

  private updateSelectedValues(
    currentValues: string[],
    value: string,
    checked: boolean
  ): string[] {
    if (checked) {
      return currentValues.includes(value)
        ? currentValues
        : [
            ...currentValues,
            value
          ];
    }

    return currentValues.filter(
      (currentValue) =>
        currentValue !== value
    );
  }
}