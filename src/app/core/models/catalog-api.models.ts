import { SortOption } from './products-page.models';

export type ProductId = string;

export type ProductBadge = 'Sale' | 'New';

export interface ProductListItemDto {
  id: ProductId;

  name: string;

  category: string;

  brand: string;

  price: number;

  oldPrice: number | null;

  rating: number;

  reviews: number;

  stock: number;

  badge: ProductBadge | null;

  image: string;
}

export interface ProductDetailsDto {
  id: ProductId;

  name: string;

  description: string;

  sku: string;

  categoryId: string;

  category: string;

  brandId: string;

  brand: string;

  price: number;

  oldPrice: number | null;

  rating: number;

  reviews: number;

  stock: number;

  isInStock: boolean;

  badge: ProductBadge | null;

  image: string;

  images: string[];
}

export interface CatalogLookupItemDto {
  id: string;

  name: string;

  slug: string;

  productCount: number;
}

export interface GetProductsRequest {
  page?: number;

  pageSize?: number;

  search?: string;

  categoryId?: string;

  brandId?: string;

  minPrice?: number;

  maxPrice?: number;

  sortBy?: SortOption;
}
