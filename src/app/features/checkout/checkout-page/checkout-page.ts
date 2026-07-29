import { CurrencyPipe } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  email,
  form,
  FormField,
  minLength,
  required,
  submit
} from '@angular/forms/signals';

import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { CartService } from '../../../core/services/cart/cart';

type PaymentMethod =
  | 'card'
  | 'cash';

interface CheckoutFormModel {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  paymentMethod: PaymentMethod;
}

@Component({
  selector: 'app-checkout-page',

  imports: [
    CurrencyPipe,
    RouterLink,
    FormField,
    ButtonModule
  ],

  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class CheckoutPage {
  private readonly cartService =
    inject(CartService);

  private readonly initialModel:
    CheckoutFormModel = {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      address: '',
      postalCode: '',
      paymentMethod: 'card'
    };

  readonly checkoutModel =
    signal<CheckoutFormModel>({
      ...this.initialModel
    });

  readonly checkoutForm = form(
    this.checkoutModel,

    (schemaPath) => {
      required(schemaPath.fullName, {
        message:
          'Full name is required.'
      });

      minLength(
        schemaPath.fullName,
        3,
        {
          message:
            'Full name must contain at least 3 characters.'
        }
      );

      required(schemaPath.email, {
        message:
          'Email address is required.'
      });

      email(schemaPath.email, {
        message:
          'Enter a valid email address.'
      });

      required(schemaPath.phone, {
        message:
          'Phone number is required.'
      });

      minLength(
        schemaPath.phone,
        8,
        {
          message:
            'Enter a valid phone number.'
        }
      );

      required(schemaPath.country, {
        message:
          'Country is required.'
      });

      required(schemaPath.city, {
        message:
          'City is required.'
      });

      required(schemaPath.address, {
        message:
          'Shipping address is required.'
      });

      minLength(
        schemaPath.address,
        8,
        {
          message:
            'Enter a complete shipping address.'
        }
      );

      required(
        schemaPath.postalCode,
        {
          message:
            'Postal code is required.'
        }
      );

      required(
        schemaPath.paymentMethod,
        {
          message:
            'Select a payment method.'
        }
      );
    }
  );

  readonly cartItems =
    this.cartService.items;

  readonly subtotal =
    this.cartService.subtotal;

  readonly shipping =
    this.cartService.shipping;

  readonly tax =
    this.cartService.tax;

  readonly total =
    this.cartService.total;

  readonly hasCartItems =
    computed(
      () =>
        this.cartItems().length > 0
    );

  readonly orderNumber =
    signal<string | null>(null);

  async placeOrder(
    event: Event
  ): Promise<void> {
    event.preventDefault();

    if (!this.hasCartItems()) {
      return;
    }

    const submitted =
      await submit(
        this.checkoutForm,

        async () => {
          const generatedOrderNumber =
            `HS-${Date.now()
              .toString()
              .slice(-8)}`;

          this.orderNumber.set(
            generatedOrderNumber
          );

          this.cartService.clearCart();
        }
      );

    if (submitted) {
      this.checkoutForm()
        .reset({
          ...this.initialModel
        });
    }
  }

  hasPendingChanges(): boolean {
    return (
      this.checkoutForm().dirty() &&
      this.orderNumber() === null
    );
  }
}