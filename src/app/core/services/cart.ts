import {
  isPlatformBrowser
} from '@angular/common';

import {
  computed,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal
} from '@angular/core';

import {
  Product
} from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey =
    'hebashop-cart';

  private readonly platformId =
    inject(PLATFORM_ID);

  private readonly isBrowser =
    isPlatformBrowser(this.platformId);

  private readonly itemsState =
    signal<CartItem[]>(
      this.loadCartFromStorage()
    );

  readonly items =
    this.itemsState.asReadonly();

  readonly totalQuantity = computed(() =>
    this.itemsState().reduce(
      (totalQuantity, item) =>
        totalQuantity + item.quantity,
      0
    )
  );

  readonly subtotal = computed(() =>
    this.itemsState().reduce(
      (totalPrice, item) =>
        totalPrice +
        item.product.price *
        item.quantity,
      0
    )
  );

  readonly shipping = computed(() => {
    const currentSubtotal =
      this.subtotal();

    if (
      currentSubtotal === 0 ||
      currentSubtotal >= 50
    ) {
      return 0;
    }

    return 9.99;
  });

  readonly tax = computed(
    () => this.subtotal() * 0.08
  );

  readonly total = computed(
    () =>
      this.subtotal() +
      this.shipping() +
      this.tax()
  );

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    effect(() => {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(
          this.itemsState()
        )
      );
    });
  }

  setProductQuantity(
    product: Product,
    requestedQuantity: number
  ): void {
    const integerQuantity =
      Number.isFinite(requestedQuantity)
        ? Math.trunc(requestedQuantity)
        : 0;

    const availableStock =
      Math.max(product.stock, 0);

    const safeQuantity = Math.min(
      Math.max(integerQuantity, 0),
      availableStock
    );

    this.itemsState.update(
      (currentItems) => {
        const existingItem =
          currentItems.find(
            (item) =>
              item.product.id ===
              product.id
          );

        if (safeQuantity === 0) {
          return currentItems.filter(
            (item) =>
              item.product.id !==
              product.id
          );
        }

        if (existingItem) {
          return currentItems.map(
            (item) =>
              item.product.id ===
              product.id
                ? {
                    product,
                    quantity:
                      safeQuantity
                  }
                : item
          );
        }

        return [
          ...currentItems,
          {
            product,
            quantity: safeQuantity
          }
        ];
      }
    );
  }

  addProduct(
    product: Product,
    quantity = 1
  ): void {
    if (quantity <= 0) {
      return;
    }

    const currentQuantity =
      this.getProductQuantity(
        product.id
      );

    this.setProductQuantity(
      product,
      currentQuantity + quantity
    );
  }

  increaseQuantity(
    productId: number
  ): void {
    const currentItem =
      this.itemsState().find(
        (item) =>
          item.product.id === productId
      );

    if (!currentItem) {
      return;
    }

    this.setProductQuantity(
      currentItem.product,
      currentItem.quantity + 1
    );
  }

  decreaseQuantity(
    productId: number
  ): void {
    const currentItem =
      this.itemsState().find(
        (item) =>
          item.product.id === productId
      );

    if (!currentItem) {
      return;
    }

    this.setProductQuantity(
      currentItem.product,
      Math.max(
        currentItem.quantity - 1,
        1
      )
    );
  }

  decreaseOrRemoveProduct(
    productId: number
  ): void {
    const currentItem =
      this.itemsState().find(
        (item) =>
          item.product.id === productId
      );

    if (!currentItem) {
      return;
    }

    this.setProductQuantity(
      currentItem.product,
      currentItem.quantity - 1
    );
  }

  removeProduct(
    productId: number
  ): void {
    this.itemsState.update(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.product.id !== productId
        )
    );
  }

  clearCart(): void {
    this.itemsState.set([]);
  }

  isProductInCart(
    productId: number
  ): boolean {
    return this.itemsState().some(
      (item) =>
        item.product.id === productId
    );
  }

  getProductQuantity(
    productId: number
  ): number {
    return (
      this.itemsState().find(
        (item) =>
          item.product.id === productId
      )?.quantity ?? 0
    );
  }

  private loadCartFromStorage():
    CartItem[] {
    if (!this.isBrowser) {
      return [];
    }

    const savedCart =
      localStorage.getItem(
        this.storageKey
      );

    if (!savedCart) {
      return [];
    }

    try {
      const parsedCart: unknown =
        JSON.parse(savedCart);

      return Array.isArray(parsedCart)
        ? parsedCart as CartItem[]
        : [];
    } catch {
      localStorage.removeItem(
        this.storageKey
      );

      return [];
    }
  }
}