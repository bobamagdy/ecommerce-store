import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-account-page',

  imports: [
    RouterLink,
    ButtonModule
  ],

 templateUrl: './account-page.html',
  styleUrl: './account-page.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AccountPage {
  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  async logout(): Promise<void> {
    this.authService.logout();

    await this.router.navigateByUrl(
      '/auth/login'
    );
  }
}