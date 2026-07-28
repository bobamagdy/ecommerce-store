import { isPlatformBrowser } from '@angular/common';

import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'hubshop-auth';

  private readonly platformId = inject(PLATFORM_ID);

  private readonly isBrowser =
    isPlatformBrowser(this.platformId);

  private readonly authenticatedState = signal(
    this.readAuthenticationState()
  );

  readonly isAuthenticated =
    this.authenticatedState.asReadonly();

  login(rememberMe: boolean): void {
    if (!this.isBrowser) {
      return;
    }

    sessionStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.storageKey);

    const selectedStorage = rememberMe
      ? localStorage
      : sessionStorage;

    selectedStorage.setItem(
      this.storageKey,
      'authenticated'
    );

    this.authenticatedState.set(true);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.storageKey);
      sessionStorage.removeItem(this.storageKey);
    }

    this.authenticatedState.set(false);
  }

  private readAuthenticationState(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    return Boolean(
      localStorage.getItem(this.storageKey) ||
      sessionStorage.getItem(this.storageKey)
    );
  }
}