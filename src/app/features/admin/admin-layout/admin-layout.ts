import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {
  AuthService
} from '../../../core/services/auth/auth';

@Component({
  selector: 'app-admin-layout',

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AdminLayout {
  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  readonly sidebarOpen =
    signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update(
      (isOpen) => !isOpen
    );
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  async logout(): Promise<void> {
    this.authService.logout();

    await this.router.navigateByUrl(
      '/auth/login'
    );
  }
}