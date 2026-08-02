import { httpResource } from '@angular/common/http';

import { computed, Injectable } from '@angular/core';

import { Product, ProductBadge } from '../../models/product.model';

import { ProductListItemDto } from '../../models/catalog-api.models';

import { PagedResult } from '../../models/paged-result.model';

const EMPTY_PRODUCTS_RESULT: PagedResult<ProductListItemDto> = {
  items: [],

  page: 1,

  pageSize: 12,

  totalCount: 0,

  totalPages: 0,

  hasPreviousPage: false,

  hasNextPage: false,
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsResource = httpResource<PagedResult<ProductListItemDto>>(
    () => ({
      url: 'api/products',

      params: {
        page: 1,

        pageSize: 12,

        sortBy: 'newest',
      },
    }),

    {
      defaultValue: EMPTY_PRODUCTS_RESULT,
    },
  );

  readonly pageResult = computed(() => {
    if (!this.productsResource.hasValue()) {
      return EMPTY_PRODUCTS_RESULT;
    }

    return this.productsResource.value();
  });

  readonly products = computed<Product[]>(() =>
    this.pageResult().items.map((product) => this.mapListItemToProduct(product)),
  );

  readonly totalCount = computed(() => this.pageResult().totalCount);

  readonly totalPages = computed(() => this.pageResult().totalPages);

  readonly currentPage = computed(() => this.pageResult().page);

  readonly pageSize = computed(() => this.pageResult().pageSize);

  readonly hasPreviousPage = computed(() => this.pageResult().hasPreviousPage);

  readonly hasNextPage = computed(() => this.pageResult().hasNextPage);

  private readonly productsById = computed(() => {
    return new Map<string, Product>(this.products().map((product) => [product.id, product]));
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

  getProductById(productId: string): Product | undefined {
    return this.productsById().get(productId);
  }

  reloadProducts(): boolean {
    return this.productsResource.reload();
  }

  private mapListItemToProduct(product: ProductListItemDto): Product {
    return {
      id: product.id,

      name: product.name,

      category: product.category,

      brand: product.brand,

      price: product.price,

      oldPrice: product.oldPrice,

      rating: product.rating,

      reviews: product.reviews,

      stock: product.stock,

      badge: product.badge as ProductBadge | null,

      image: product.image,

      images: product.image ? [product.image] : [],

      /*
       * List endpoint does not return
       * details fields yet.
       */
      description: '',

      sku: '',
    };
  }
}
