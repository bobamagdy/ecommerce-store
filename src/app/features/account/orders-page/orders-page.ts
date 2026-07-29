import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { OrderStatus } from '../../../core/models/order.model';

import { OrderService } from '../../../core/services/order/order';

import { ImageFallback } from '../../../shared/directives/image-fallback/image-fallback';

@Component({
  selector: 'app-orders-page',

  imports: [CurrencyPipe, DatePipe, TitleCasePipe, RouterLink, ButtonModule, ImageFallback],

  templateUrl: './orders-page.html',

  styleUrl: './orders-page.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage {
  private readonly orderService = inject(OrderService);

  readonly orders = this.orderService.orders;

  readonly totalOrders = this.orderService.totalOrders;

  readonly isEmpty = this.orderService.isEmpty;

  getStatusIcon(status: OrderStatus): string {
    switch (status) {
      case 'confirmed':
        return 'pi-check-circle';

      case 'shipped':
        return 'pi-truck';

      case 'delivered':
        return 'pi-verified';

      case 'cancelled':
        return 'pi-times-circle';

      case 'processing':
      default:
        return 'pi-clock';
    }
  }
}
