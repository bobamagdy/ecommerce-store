export type ProductBadge = 'Sale' | 'New';

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;

  price: number;
  oldPrice?: number;

  rating: number;
  reviews: number;

  badge?: ProductBadge;

  image: string;
  images: string[];

  description: string;

  stock: number;
  sku: string;
}