import { computed, effect, inject, Service, signal } from '@angular/core';

import { BROWSER_STORAGE } from '../../tokens/browser-storage';

@Service()
export class WishlistService {
  /*
   * نحافظ على المفتاح القديم حتى
   * لا تختفي المنتجات المحفوظة.
   */
  private readonly storageKey = 'hubshop-wishlist';

  private readonly storage = inject(BROWSER_STORAGE);

  private readonly productIdsState = signal<number[]>(this.loadWishlist());

  readonly productIds = this.productIdsState.asReadonly();

  /*
   * Set مشتقة للبحث السريع عن المنتج.
   */
  private readonly productIdsSet = computed(() => new Set(this.productIdsState()));

  readonly totalItems = computed(() => this.productIdsState().length);

  readonly isEmpty = computed(() => this.productIdsState().length === 0);

  constructor() {
    /*
     * أثناء SSR ستكون Storage = null.
     */
    if (!this.storage) {
      return;
    }

    /*
     * حفظ أي تغيير يحدث في القائمة.
     */
    effect(() => {
      this.storage?.setItem(
        this.storageKey,

        JSON.stringify(this.productIdsState()),
      );
    });
  }

  addProduct(productId: number): void {
    if (!this.isValidProductId(productId) || this.isFavorite(productId)) {
      return;
    }

    this.productIdsState.update((currentIds) => [...currentIds, productId]);
  }

  toggleProduct(productId: number): void {
    if (!this.isValidProductId(productId)) {
      return;
    }

    if (this.isFavorite(productId)) {
      this.removeProduct(productId);
      return;
    }

    this.addProduct(productId);
  }

  removeProduct(productId: number): void {
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

  isFavorite(productId: number): boolean {
    return this.productIdsSet().has(productId);
  }

  private loadWishlist(): number[] {
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

      /*
       * نتخلص من:
       *
       * القيم غير الرقمية
       * الأرقام السالبة
       * الكسور
       * القيم المتكررة
       */
      return [
        ...new Set(parsedWishlist.filter((value): value is number => this.isValidProductId(value))),
      ];
    } catch {
      this.storage.removeItem(this.storageKey);

      return [];
    }
  }

  private isValidProductId(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value > 0;
  }
}
