import {
  Product
} from './product.model';

export type PaymentMethod =
  | 'card'
  | 'cash';

export type OrderStatus =
  | 'processing'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface CheckoutCustomer {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export interface StoreOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  customer: CheckoutCustomer;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CreateOrderInput {
  customer: CheckoutCustomer;
  paymentMethod: PaymentMethod;

  items: readonly {
    product: Product;
    quantity: number;
  }[];

  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}