import { Component, signal } from '@angular/core';

import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-store-footer',

  imports: [RouterLink, ButtonModule, InputTextModule],

  templateUrl: './store-footer.html',
  styleUrl: './store-footer.scss',
})
export class StoreFooter {
  readonly currentYear = new Date().getFullYear();

  readonly subscriptionMessage = signal('');

  subscribe(emailInput: HTMLInputElement): void {
    const email = emailInput.value.trim();

    if (!email) {
      this.subscriptionMessage.set('Please enter your email address.');

      emailInput.focus();

      return;
    }

    if (!emailInput.validity.valid) {
      this.subscriptionMessage.set('Please enter a valid email address.');

      emailInput.focus();

      return;
    }

    this.subscriptionMessage.set('Thank you for subscribing!');

    emailInput.value = '';
  }
}
