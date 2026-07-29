import { CurrencyPipe, DatePipe } from '@angular/common';

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { OrderStatus } from '../../../../core/models/order.model';

import { OrderService } from '../../../../core/services/order/order';

@Component({
  selector: 'app-admin-orders',

  imports: [CurrencyPipe, DatePipe],

  templateUrl: './admin-orders.html',

  styleUrl: '../../admin-page.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrders {
  private readonly orderService = inject(OrderService);

  readonly orders = this.orderService.orders;

  readonly searchQuery = signal('');

  readonly selectedStatus = signal<OrderStatus | 'all'>('all');

  readonly statusOptions: readonly OrderStatus[] = [
    'processing',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled',
  ];

  readonly filteredOrders = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();

    const status = this.selectedStatus();

    return this.orders().filter((order) => {
      const searchMatches =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.fullName.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query);

      const statusMatches = status === 'all' || order.status === status;

      return searchMatches && statusMatches;
    });
  });

  updateSearch(event: Event): void {
    const inputElement = event.currentTarget as HTMLInputElement;

    this.searchQuery.set(inputElement.value);
  }

  updateStatusFilter(event: Event): void {
    const selectElement = event.currentTarget as HTMLSelectElement;

    const value = selectElement.value;

    if (value === 'all' || this.isOrderStatus(value)) {
      this.selectedStatus.set(value);
    }
  }

  changeOrderStatus(orderId: string, event: Event): void {
    const selectElement = event.currentTarget as HTMLSelectElement;

    const value = selectElement.value;

    if (!this.isOrderStatus(value)) {
      return;
    }

    this.orderService.updateOrderStatus(orderId, value);
  }

  private isOrderStatus(value: string): value is OrderStatus {
    return this.statusOptions.includes(value as OrderStatus);
  }
}
