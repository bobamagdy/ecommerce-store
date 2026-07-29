import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { Product } from '../../../core/models/product.model';

import { CartService } from '../../../core/services/cart/cart';

import { ProductService } from '../../../core/services/product/product';

import { WishlistService } from '../../../core/services/wishlist/wishlist';

import { ProductCard } from '../../../shared/components/product-card/product-card';

import { ProductGridSkeleton } from '../../../shared/components/product-grid-skeleton/product-grid-skeleton';

import { ProductsFilters } from '../products-filters/products-filters';

import { ProductsToolbar } from '../products-toolbar/products-toolbar';

import {
  DEFAULT_MAX_PRICE,
  FilterOption,
  FilterSelectionChange,
  MINIMUM_PRICE,
  ProductsView,
  SORT_OPTIONS,
  SortOption,
} from '../../../core/models/products-page.models';

@Component({
  selector: 'app-products-page',

  imports: [ButtonModule, ProductCard, ProductGridSkeleton, ProductsFilters, ProductsToolbar],

  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage {
  private readonly productService = inject(ProductService);

  private readonly cartService = inject(CartService);

  private readonly wishlistService = inject(WishlistService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  readonly products = this.productService.products;

  readonly productsLoading = this.productService.isLoading;

  readonly initialProductsLoading = this.productService.isInitialLoading;

  readonly productsReloading = this.productService.isReloading;

  readonly productsLoadError = this.productService.hasBlockingError;

  readonly productsErrorMessage = this.productService.errorMessage;

  readonly categories: readonly FilterOption[] = [
    {
      name: 'Electronics',
      count: 128,
    },
    {
      name: 'Fashion',
      count: 156,
    },
    {
      name: 'Beauty',
      count: 98,
    },
    {
      name: 'Home & Living',
      count: 112,
    },
    {
      name: 'Sports',
      count: 74,
    },
  ];

  readonly brands: readonly FilterOption[] = [
    {
      name: 'Apple',
      count: 32,
    },
    {
      name: 'Sony',
      count: 28,
    },
    {
      name: 'Nike',
      count: 18,
    },
    {
      name: 'Adidas',
      count: 16,
    },
    {
      name: 'Philips',
      count: 14,
    },
    {
      name: 'Michael Kors',
      count: 10,
    },
    {
      name: 'Lancôme',
      count: 8,
    },
    {
      name: 'IKEA',
      count: 12,
    },
  ];

  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly searchQuery = computed(() => this.queryParamMap().get('q')?.trim() ?? '');

  readonly selectedCategories = computed(() => {
    const routeCategories = this.queryParamMap().getAll('category');

    return routeCategories.filter((categoryName) =>
      this.categories.some((category) => category.name === categoryName),
    );
  });

  readonly selectedBrands = computed(() => {
    const routeBrands = this.queryParamMap().getAll('brand');

    return routeBrands.filter((brandName) => this.brands.some((brand) => brand.name === brandName));
  });

  readonly maxPrice = computed(() => {
    const routeValue = this.queryParamMap().get('maxPrice');

    const parsedValue = Number(routeValue);

    if (!routeValue || !Number.isFinite(parsedValue)) {
      return DEFAULT_MAX_PRICE;
    }

    return Math.min(Math.max(parsedValue, MINIMUM_PRICE), DEFAULT_MAX_PRICE);
  });

  readonly sortBy = computed<SortOption>(() => {
    const routeSorting = this.queryParamMap().get('sort');

    return this.isSortOption(routeSorting) ? routeSorting : 'newest';
  });

  readonly view = computed<ProductsView>(() =>
    this.queryParamMap().get('view') === 'list' ? 'list' : 'grid',
  );

  readonly gridView = computed(() => this.view() === 'grid');

  readonly hasActiveFilters = computed(
    () =>
      this.searchQuery().length > 0 ||
      this.selectedCategories().length > 0 ||
      this.selectedBrands().length > 0 ||
      this.maxPrice() !== DEFAULT_MAX_PRICE ||
      this.sortBy() !== 'newest' ||
      this.view() !== 'grid',
  );

  readonly filteredProducts = computed<Product[]>(() => {
    const normalizedSearch = this.searchQuery().toLowerCase();

    const selectedCategories = this.selectedCategories();

    const selectedBrands = this.selectedBrands();

    const maximumPrice = this.maxPrice();

    const selectedSorting = this.sortBy();

    const filteredItems = this.products().filter((product) => {
      const searchMatches =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        product.brand.toLowerCase().includes(normalizedSearch);

      const categoryMatches =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      const brandMatches = selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      const priceMatches = product.price <= maximumPrice;

      return searchMatches && categoryMatches && brandMatches && priceMatches;
    });

    return [...filteredItems].sort((firstProduct, secondProduct) => {
      switch (selectedSorting) {
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

  retryLoadingProducts(): void {
    this.productService.reloadProducts();
  }

  changeCategory(change: FilterSelectionChange): void {
    const updatedCategories = this.updateSelectedValues(
      this.selectedCategories(),
      change.value,
      change.checked,
    );

    this.updateQueryParams({
      category: updatedCategories.length > 0 ? updatedCategories : null,
    });
  }

  changeBrand(change: FilterSelectionChange): void {
    const updatedBrands = this.updateSelectedValues(
      this.selectedBrands(),
      change.value,
      change.checked,
    );

    this.updateQueryParams({
      brand: updatedBrands.length > 0 ? updatedBrands : null,
    });
  }

  changeMaximumPrice(selectedPrice: number): void {
    this.updateQueryParams({
      maxPrice: selectedPrice === DEFAULT_MAX_PRICE ? null : selectedPrice,
    });
  }

  changeSorting(sorting: SortOption): void {
    this.updateQueryParams({
      sort: sorting === 'newest' ? null : sorting,
    });
  }

  changeView(view: ProductsView): void {
    this.updateQueryParams({
      view: view === 'grid' ? null : 'list',
    });
  }

  isFavorite(productId: number): boolean {
    return this.wishlistService.isFavorite(productId);
  }

  setFavorite(productId: number, shouldBeFavorite: boolean): void {
    const currentlyFavorite = this.wishlistService.isFavorite(productId);

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

  clearSearch(): void {
    this.updateQueryParams({
      q: null,
    });
  }

  resetFilters(): void {
    void this.router.navigate([], {
      relativeTo: this.route,

      queryParams: {
        q: null,
        category: null,
        brand: null,
        maxPrice: null,
        sort: null,
        view: null,
      },

      replaceUrl: true,
    });
  }

  private updateQueryParams(queryParams: Params): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private updateSelectedValues(
    currentValues: readonly string[],
    value: string,
    checked: boolean,
  ): string[] {
    if (checked) {
      return currentValues.includes(value) ? [...currentValues] : [...currentValues, value];
    }

    return currentValues.filter((currentValue) => currentValue !== value);
  }

  private isSortOption(value: string | null): value is SortOption {
    return value !== null && SORT_OPTIONS.includes(value as SortOption);
  }
}
