import { HttpClient, HttpParams } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  CatalogLookupItemDto,
  GetProductsRequest,
  ProductDetailsDto,
  ProductListItemDto,
} from '../../models/catalog-api.models';

import { PagedResult } from '../../models/paged-result.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogApiService {
  private readonly http = inject(HttpClient);

  getProducts(request: GetProductsRequest = {}): Observable<PagedResult<ProductListItemDto>> {
    const params = this.createProductsParams(request);

    return this.http.get<PagedResult<ProductListItemDto>>('api/products', {
      params,
    });
  }

  getProductById(productId: string): Observable<ProductDetailsDto> {
    const encodedProductId = encodeURIComponent(productId);

    return this.http.get<ProductDetailsDto>(`api/products/${encodedProductId}`);
  }

  getCategories(): Observable<CatalogLookupItemDto[]> {
    return this.http.get<CatalogLookupItemDto[]>('api/categories');
  }

  getBrands(): Observable<CatalogLookupItemDto[]> {
    return this.http.get<CatalogLookupItemDto[]>('api/brands');
  }

  private createProductsParams(request: GetProductsRequest): HttpParams {
    let params = new HttpParams()
      .set('page', String(request.page ?? 1))
      .set('pageSize', String(request.pageSize ?? 12))
      .set('sortBy', request.sortBy ?? 'newest');

    const normalizedSearch = request.search?.trim();

    if (normalizedSearch) {
      params = params.set('search', normalizedSearch);
    }

    if (request.categoryId) {
      params = params.set('categoryId', request.categoryId);
    }

    if (request.brandId) {
      params = params.set('brandId', request.brandId);
    }

    if (request.minPrice !== undefined) {
      params = params.set('minPrice', String(request.minPrice));
    }

    if (request.maxPrice !== undefined) {
      params = params.set('maxPrice', String(request.maxPrice));
    }

    return params;
  }
}
