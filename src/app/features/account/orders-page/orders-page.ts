import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-orders-page',

  imports: [
    RouterLink,
    ButtonModule
  ],

  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class OrdersPage {}