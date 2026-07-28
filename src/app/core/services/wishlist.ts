import { isPlatformBrowser } from '@angular/common';

import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly storageKey = 'hubshop-wishlist';

  private readonly platformId = inject(PLATFORM_ID);

  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly productIdsState = signal<number[]>(this.loadWishlist());

  readonly productIds = this.productIdsState.asReadonly();

  readonly totalItems = computed(() => this.productIdsState().length);

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.productIdsState()));
    });
  }

  toggleProduct(productId: number): void {
    this.productIdsState.update((currentIds) =>
      currentIds.includes(productId)
        ? currentIds.filter((currentId) => currentId !== productId)
        : [...currentIds, productId],
    );
  }

  isFavorite(productId: number): boolean {
    return this.productIdsState().includes(productId);
  }

  clearWishlist(): void {
    this.productIdsState.set([]);
  }

  removeProduct(productId: number): void {
    this.productIdsState.update((currentIds) =>
      currentIds.filter((currentId) => currentId !== productId),
    );
  }

  private loadWishlist(): number[] {
    if (!this.isBrowser) {
      return [];
    }

    const storedWishlist = localStorage.getItem(this.storageKey);

    if (!storedWishlist) {
      return [];
    }

    try {
      const parsedWishlist: unknown = JSON.parse(storedWishlist);

      return Array.isArray(parsedWishlist)
        ? parsedWishlist.filter((value): value is number => typeof value === 'number')
        : [];
    } catch {
      localStorage.removeItem(this.storageKey);

      return [];
    }
  }
}
