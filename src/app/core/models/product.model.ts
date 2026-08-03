export type ProductBadge = 'Sale' | 'New';

export interface Product {
  id: string;

  name: string;

  category: string;

  brand: string;

  price: number;

  oldPrice: number | null;

  rating: number;

  reviews: number;

  badge: ProductBadge | null;

  image: string;

  images: string[];

  description: string;

  stock: number;

  sku: string;
}
