import { inject, Service, signal } from '@angular/core';

import { BROWSER_SESSION_STORAGE, BROWSER_STORAGE } from '../../tokens/browser-storage';

@Service()
export class AuthService {
  private readonly storageKey = 'hubshop-auth';

  private readonly authenticationMarker = 'authenticated';

  private readonly localStorage = inject(BROWSER_STORAGE);

  private readonly sessionStorage = inject(BROWSER_SESSION_STORAGE);

  private readonly authenticatedState = signal(this.readAuthenticationState());

  readonly isAuthenticated = this.authenticatedState.asReadonly();

  login(rememberMe: boolean): void {
    /*
     * نحذف أي Session قديمة أولًا
     * حتى يكون للتطبيق مصدر واحد فقط.
     */
    this.clearStoredAuthentication();

    const selectedStorage = rememberMe ? this.localStorage : this.sessionStorage;

    /*
     * أثناء SSR لا توجد Browser Storage.
     */
    if (!selectedStorage) {
      this.authenticatedState.set(false);

      return;
    }

    selectedStorage.setItem(this.storageKey, this.authenticationMarker);

    this.authenticatedState.set(true);
  }

  logout(): void {
    this.clearStoredAuthentication();

    this.authenticatedState.set(false);
  }

  private readAuthenticationState(): boolean {
    return (
      this.hasValidAuthentication(this.localStorage) ||
      this.hasValidAuthentication(this.sessionStorage)
    );
  }

  private hasValidAuthentication(storage: Storage | null): boolean {
    return storage?.getItem(this.storageKey) === this.authenticationMarker;
  }

  private clearStoredAuthentication(): void {
    this.localStorage?.removeItem(this.storageKey);

    this.sessionStorage?.removeItem(this.storageKey);
  }
}
