import {
  computed,
  effect,
  inject,
  Service,
  signal
} from '@angular/core';

import {
  CreateOrderInput,
  OrderItem,
  OrderStatus,
  StoreOrder
} from '../../models/order.model';

import {
  BROWSER_STORAGE
} from '../../tokens/browser-storage';

@Service()
export class OrderService {
  private readonly storageKey =
    'hubshop-orders';

  private readonly storage =
    inject(BROWSER_STORAGE);

  private readonly ordersState =
    signal<StoreOrder[]>(
      this.loadOrders()
    );

  private orderSequence = 0;

  readonly orders =
    this.ordersState.asReadonly();

  readonly totalOrders =
    computed(
      () =>
        this.ordersState().length
    );

  readonly isEmpty =
    computed(
      () =>
        this.ordersState().length === 0
    );

  readonly latestOrder =
    computed(
      () =>
        this.ordersState()[0] ??
        null
    );

  constructor() {
    if (!this.storage) {
      return;
    }

    effect(() => {
      this.storage?.setItem(
        this.storageKey,
        JSON.stringify(
          this.ordersState()
        )
      );
    });
  }

  createOrder(
    input: CreateOrderInput
  ): StoreOrder {
    const now =
      new Date();

    const orderNumber =
      this.createOrderNumber(
        now.getTime()
      );

    const orderItems:
      OrderItem[] =
        input.items.map(
          (item) => ({
            product: item.product,

            quantity:
              Math.max(
                Math.trunc(
                  item.quantity
                ),
                1
              ),

            lineTotal:
              item.product.price *
              Math.max(
                Math.trunc(
                  item.quantity
                ),
                1
              )
          })
        );

    const order:
      StoreOrder = {
        id: orderNumber,
        orderNumber,
        createdAt:
          now.toISOString(),
        status: 'processing',
        customer: {
          ...input.customer
        },
        paymentMethod:
          input.paymentMethod,
        items: orderItems,
        subtotal: input.subtotal,
        shipping: input.shipping,
        tax: input.tax,
        total: input.total
      };

    this.ordersState.update(
      (currentOrders) => [
        order,
        ...currentOrders
      ]
    );

    return order;
  }

  getOrderById(
    orderId: string
  ): StoreOrder | undefined {
    return this.ordersState()
      .find(
        (order) =>
          order.id === orderId
      );
  }

  updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): void {
    this.ordersState.update(
      (currentOrders) =>
        currentOrders.map(
          (order) =>
            order.id === orderId
              ? {
                  ...order,
                  status
                }
              : order
        )
    );
  }

  clearOrders(): void {
    this.ordersState.set([]);
  }

  private createOrderNumber(
    timestamp: number
  ): string {
    this.orderSequence += 1;

    const timestampPart =
      timestamp
        .toString(36)
        .toUpperCase();

    const sequencePart =
      this.orderSequence
        .toString()
        .padStart(3, '0');

    return (
      `HS-${timestampPart}-${sequencePart}`
    );
  }

  private loadOrders():
    StoreOrder[] {
    if (!this.storage) {
      return [];
    }

    const storedOrders =
      this.storage.getItem(
        this.storageKey
      );

    if (!storedOrders) {
      return [];
    }

    try {
      const parsedOrders:
        unknown =
          JSON.parse(
            storedOrders
          );

      if (
        !Array.isArray(
          parsedOrders
        )
      ) {
        return [];
      }

      return parsedOrders
        .filter(
          (
            order
          ): order is StoreOrder =>
            this.isStoreOrder(
              order
            )
        )
        .sort(
          (
            firstOrder,
            secondOrder
          ) =>
            new Date(
              secondOrder.createdAt
            ).getTime() -
            new Date(
              firstOrder.createdAt
            ).getTime()
        );
    } catch {
      this.storage.removeItem(
        this.storageKey
      );

      return [];
    }
  }

  private isStoreOrder(
    value: unknown
  ): value is StoreOrder {
    if (
      typeof value !== 'object' ||
      value === null
    ) {
      return false;
    }

    const order =
      value as Record<
        string,
        unknown
      >;

    if (
      typeof order['id'] !==
        'string' ||
      typeof order[
        'orderNumber'
      ] !== 'string' ||
      typeof order[
        'createdAt'
      ] !== 'string' ||
      Number.isNaN(
        Date.parse(
          order[
            'createdAt'
          ] as string
        )
      ) ||
      !this.isOrderStatus(
        order['status']
      ) ||
      !this.isPaymentMethod(
        order[
          'paymentMethod'
        ]
      ) ||
      !this.isFiniteNumber(
        order['subtotal']
      ) ||
      !this.isFiniteNumber(
        order['shipping']
      ) ||
      !this.isFiniteNumber(
        order['tax']
      ) ||
      !this.isFiniteNumber(
        order['total']
      ) ||
      !Array.isArray(
        order['items']
      ) ||
      !order['items'].every(
        (item) =>
          this.isOrderItem(item)
      )
    ) {
      return false;
    }

    return this.isCustomer(
      order['customer']
    );
  }

  private isOrderItem(
    value: unknown
  ): value is OrderItem {
    if (
      typeof value !== 'object' ||
      value === null
    ) {
      return false;
    }

    const item =
      value as Record<
        string,
        unknown
      >;

    const product =
      item['product'];

    if (
      typeof product !== 'object' ||
      product === null
    ) {
      return false;
    }

    const productValue =
      product as Record<
        string,
        unknown
      >;

    return (
      this.isFiniteNumber(
        item['quantity']
      ) &&
      (
        item['quantity'] as number
      ) > 0 &&
      this.isFiniteNumber(
        item['lineTotal']
      ) &&
      typeof productValue['id'] ===
        'number' &&
      typeof productValue['name'] ===
        'string' &&
      typeof productValue['image'] ===
        'string' &&
      this.isFiniteNumber(
        productValue['price']
      )
    );
  }

  private isCustomer(
    value: unknown
  ): boolean {
    if (
      typeof value !== 'object' ||
      value === null
    ) {
      return false;
    }

    const customer =
      value as Record<
        string,
        unknown
      >;

    return [
      'fullName',
      'email',
      'phone',
      'country',
      'city',
      'address',
      'postalCode'
    ].every(
      (propertyName) =>
        typeof customer[
          propertyName
        ] === 'string'
    );
  }

  private isPaymentMethod(
    value: unknown
  ): value is
    StoreOrder[
      'paymentMethod'
    ] {
    return (
      value === 'card' ||
      value === 'cash'
    );
  }

  private isOrderStatus(
    value: unknown
  ): value is OrderStatus {
    return (
      value === 'processing' ||
      value === 'confirmed' ||
      value === 'shipped' ||
      value === 'delivered' ||
      value === 'cancelled'
    );
  }

  private isFiniteNumber(
    value: unknown
  ): value is number {
    return (
      typeof value === 'number' &&
      Number.isFinite(value)
    );
  }
}