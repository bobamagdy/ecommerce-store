import {
  CurrencyPipe,
  DatePipe,
  TitleCasePipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  OrderService
} from '../../../../core/services/order/order';

import {
  ProductService
} from '../../../../core/services/product/product';

@Component({
  selector: 'app-admin-dashboard',

  imports: [
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    RouterLink
  ],

  templateUrl:
    './admin-dashboard.html',

  styleUrl:
    '../../admin-page.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AdminDashboard {
  private readonly productService =
    inject(ProductService);

  private readonly orderService =
    inject(OrderService);

  readonly products =
    this.productService.products;

  readonly orders =
    this.orderService.orders;

  readonly totalProducts =
    computed(
      () =>
        this.products().length
    );

  readonly totalOrders =
    this.orderService.totalOrders;

  readonly totalRevenue =
    computed(() =>
      this.orders()
        .filter(
          (order) =>
            order.status !==
            'cancelled'
        )
        .reduce(
          (total, order) =>
            total + order.total,
          0
        )
    );

  readonly lowStockProducts =
    computed(
      () =>
        this.products().filter(
          (product) =>
            product.stock > 0 &&
            product.stock <= 5
        ).length
    );

  readonly recentOrders =
    computed(
      () =>
        this.orders().slice(0, 5)
    );
}