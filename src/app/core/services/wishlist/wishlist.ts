import { computed, effect, inject, Service, signal } from '@angular/core';

import { BROWSER_STORAGE } from '../../tokens/browser-storage';

@Service()
export class WishlistService {
  private readonly storageKey = 'hubshop-wishlist';

  private readonly storage = inject(BROWSER_STORAGE);

  private readonly productIdsState = signal<string[]>(this.loadWishlist());

  readonly productIds = this.productIdsState.asReadonly();

  private readonly productIdsSet = computed(() => new Set(this.productIdsState()));

  readonly totalItems = computed(() => this.productIdsState().length);

  readonly isEmpty = computed(() => this.productIdsState().length === 0);

  constructor() {
    if (!this.storage) {
      return;
    }

    effect(() => {
      this.storage?.setItem(
        this.storageKey,

        JSON.stringify(this.productIdsState()),
      );
    });
  }

  addProduct(productId: string): void {
    if (!this.isValidProductId(productId) || this.isFavorite(productId)) {
      return;
    }

    this.productIdsState.update((currentIds) => [...currentIds, productId]);
  }

  toggleProduct(productId: string): void {
    if (!this.isValidProductId(productId)) {
      return;
    }

    if (this.isFavorite(productId)) {
      this.removeProduct(productId);

      return;
    }

    this.addProduct(productId);
  }

  removeProduct(productId: string): void {
    if (!this.isValidProductId(productId)) {
      return;
    }

    this.productIdsState.update((currentIds) =>
      currentIds.filter((currentId) => currentId !== productId),
    );
  }

  clearWishlist(): void {
    this.productIdsState.set([]);
  }

  isFavorite(productId: string): boolean {
    return this.productIdsSet().has(productId);
  }

  private loadWishlist(): string[] {
    if (!this.storage) {
      return [];
    }

    const storedWishlist = this.storage.getItem(this.storageKey);

    if (!storedWishlist) {
      return [];
    }

    try {
      const parsedWishlist: unknown = JSON.parse(storedWishlist);

      if (!Array.isArray(parsedWishlist)) {
        return [];
      }

      return [
        ...new Set(parsedWishlist.filter((value): value is string => this.isValidProductId(value))),
      ];
    } catch {
      this.storage.removeItem(this.storageKey);

      return [];
    }
  }

  private isValidProductId(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }
}
