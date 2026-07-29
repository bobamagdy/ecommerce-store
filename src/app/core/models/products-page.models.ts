export type SortOption =
  | 'newest'
  | 'price-low'
  | 'price-high'
  | 'rating';

export type ProductsView =
  | 'grid'
  | 'list';

export interface FilterOption {
  name: string;
  count: number;
}

export interface FilterSelectionChange {
  value: string;
  checked: boolean;
}

export const DEFAULT_MAX_PRICE = 600;
export const MINIMUM_PRICE = 10;

export const SORT_OPTIONS: readonly SortOption[] = [
  'newest',
  'price-low',
  'price-high',
  'rating'
];