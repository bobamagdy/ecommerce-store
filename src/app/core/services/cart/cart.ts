import { computed, effect, inject, Service, signal } from '@angular/core';

import { Product } from '../../models/product.model';

import { BROWSER_STORAGE } from '../../tokens/browser-storage';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Service()
export class CartService {
  /*
   * هنحافظ على اسم المفتاح الحالي
   * حتى لا تختفي السلة المحفوظة.
   */
  private readonly storageKey = 'hebashop-cart';

  private readonly storage = inject(BROWSER_STORAGE);

  private readonly itemsState = signal<CartItem[]>(this.loadCartFromStorage());

  readonly items = this.itemsState.asReadonly();

  /*
   * Lookup مشتقة من عناصر السلة.
   *
   * تتكوّن من جديد فقط عند تغير
   * itemsState.
   */
  private readonly itemsByProductId = computed(
    () => new Map<number, CartItem>(this.itemsState().map((item) => [item.product.id, item])),
  );

  readonly totalQuantity = computed(() =>
    this.itemsState().reduce(
      (totalQuantity, item) => totalQuantity + item.quantity,

      0,
    ),
  );

  readonly subtotal = computed(() =>
    this.itemsState().reduce(
      (totalPrice, item) => totalPrice + item.product.price * item.quantity,

      0,
    ),
  );

  readonly shipping = computed(() => {
    const currentSubtotal = this.subtotal();

    if (currentSubtotal === 0 || currentSubtotal >= 50) {
      return 0;
    }

    return 9.99;
  });

  readonly tax = computed(() => this.subtotal() * 0.08);

  readonly total = computed(() => this.subtotal() + this.shipping() + this.tax());

  constructor() {
    /*
     * أثناء SSR لا يوجد Browser Storage.
     */
    if (!this.storage) {
      return;
    }

    /*
     * Side Effect مناسب:
     * مزامنة Signal مع Storage API.
     */
    effect(() => {
      this.storage?.setItem(
        this.storageKey,

        JSON.stringify(this.itemsState()),
      );
    });
  }

  setProductQuantity(product: Product, requestedQuantity: number): void {
    const integerQuantity = Number.isFinite(requestedQuantity) ? Math.trunc(requestedQuantity) : 0;

    const availableStock = Math.max(Math.trunc(product.stock), 0);

    const safeQuantity = Math.min(
      Math.max(integerQuantity, 0),

      availableStock,
    );

    this.itemsState.update((currentItems) => {
      const existingItem = this.itemsByProductId().get(product.id);

      if (safeQuantity === 0) {
        return currentItems.filter((item) => item.product.id !== product.id);
      }

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                product,
                quantity: safeQuantity,
              }
            : item,
        );
      }

      return [
        ...currentItems,

        {
          product,
          quantity: safeQuantity,
        },
      ];
    });
  }

  addProduct(product: Product, quantity = 1): void {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return;
    }

    const currentQuantity = this.getProductQuantity(product.id);

    this.setProductQuantity(product, currentQuantity + quantity);
  }

  increaseQuantity(productId: number): void {
    const currentItem = this.itemsByProductId().get(productId);

    if (!currentItem) {
      return;
    }

    this.setProductQuantity(currentItem.product, currentItem.quantity + 1);
  }

  /*
   * تقلل الكمية لكن لا تحذف المنتج.
   */
  decreaseQuantity(productId: number): void {
    const currentItem = this.itemsByProductId().get(productId);

    if (!currentItem) {
      return;
    }

    this.setProductQuantity(
      currentItem.product,

      Math.max(currentItem.quantity - 1, 1),
    );
  }

  /*
   * تقلل الكمية وتحذف المنتج
   * عندما تصل إلى صفر.
   */
  decreaseOrRemoveProduct(productId: number): void {
    const currentItem = this.itemsByProductId().get(productId);

    if (!currentItem) {
      return;
    }

    this.setProductQuantity(currentItem.product, currentItem.quantity - 1);
  }

  removeProduct(productId: number): void {
    this.itemsState.update((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    );
  }

  clearCart(): void {
    this.itemsState.set([]);
  }

  isProductInCart(productId: number): boolean {
    return this.itemsByProductId().has(productId);
  }

  getProductQuantity(productId: number): number {
    return this.itemsByProductId().get(productId)?.quantity ?? 0;
  }

  private loadCartFromStorage(): CartItem[] {
    if (!this.storage) {
      return [];
    }

    const savedCart = this.storage.getItem(this.storageKey);

    if (!savedCart) {
      return [];
    }

    try {
      const parsedCart: unknown = JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        return [];
      }

      return parsedCart
        .filter((item): item is CartItem => this.isCartItem(item))
        .map((item) => {
          const availableStock = Math.max(Math.trunc(item.product.stock), 0);

          const safeQuantity = Math.min(
            Math.max(Math.trunc(item.quantity), 0),

            availableStock,
          );

          return {
            product: item.product,

            quantity: safeQuantity,
          };
        })
        .filter((item) => item.quantity > 0);
    } catch {
      this.storage.removeItem(this.storageKey);

      return [];
    }
  }

  private isCartItem(value: unknown): value is CartItem {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const item = value as Record<string, unknown>;

    const productValue = item['product'];

    const quantityValue = item['quantity'];

    if (
      typeof quantityValue !== 'number' ||
      !Number.isFinite(quantityValue) ||
      quantityValue <= 0
    ) {
      return false;
    }

    if (typeof productValue !== 'object' || productValue === null) {
      return false;
    }

    const product = productValue as Record<string, unknown>;

    return (
      typeof product['id'] === 'number' &&
      Number.isInteger(product['id']) &&
      typeof product['name'] === 'string' &&
      typeof product['category'] === 'string' &&
      typeof product['brand'] === 'string' &&
      typeof product['price'] === 'number' &&
      Number.isFinite(product['price']) &&
      typeof product['rating'] === 'number' &&
      Number.isFinite(product['rating']) &&
      typeof product['reviews'] === 'number' &&
      Number.isFinite(product['reviews']) &&
      typeof product['image'] === 'string' &&
      Array.isArray(product['images']) &&
      product['images'].every((image) => typeof image === 'string') &&
      typeof product['description'] === 'string' &&
      typeof product['stock'] === 'number' &&
      Number.isFinite(product['stock']) &&
      typeof product['sku'] === 'string'
    );
  }
}
