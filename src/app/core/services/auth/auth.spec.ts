import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BROWSER_SESSION_STORAGE, BROWSER_STORAGE } from '../../tokens/browser-storage';

import { AuthService } from './auth';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe('AuthService', () => {
  let localStorageMock: MemoryStorage;

  let sessionStorageMock: MemoryStorage;

  beforeEach(() => {
    TestBed.resetTestingModule();

    localStorageMock = new MemoryStorage();

    sessionStorageMock = new MemoryStorage();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function createService(
    localStorageValue: Storage | null = localStorageMock,

    sessionStorageValue: Storage | null = sessionStorageMock,
  ): AuthService {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BROWSER_STORAGE,

          useValue: localStorageValue,
        },

        {
          provide: BROWSER_SESSION_STORAGE,

          useValue: sessionStorageValue,
        },
      ],
    });

    return TestBed.inject(AuthService);
  }

  it('should start unauthenticated', () => {
    const service = createService();

    expect(service.isAuthenticated()).toBe(false);
  });

  it('should restore authentication from local storage', () => {
    localStorageMock.setItem('hubshop-auth', 'authenticated');

    const service = createService();

    expect(service.isAuthenticated()).toBe(true);
  });

  it('should restore authentication from session storage', () => {
    sessionStorageMock.setItem('hubshop-auth', 'authenticated');

    const service = createService();

    expect(service.isAuthenticated()).toBe(true);
  });

  it('should ignore an invalid stored value', () => {
    localStorageMock.setItem('hubshop-auth', 'invalid-value');

    const service = createService();

    expect(service.isAuthenticated()).toBe(false);
  });

  it('should use local storage when remember me is enabled', () => {
    const service = createService();

    service.login(true);

    expect(service.isAuthenticated()).toBe(true);

    expect(localStorageMock.getItem('hubshop-auth')).toBe('authenticated');

    expect(sessionStorageMock.getItem('hubshop-auth')).toBeNull();
  });

  it('should use session storage when remember me is disabled', () => {
    const service = createService();

    service.login(false);

    expect(service.isAuthenticated()).toBe(true);

    expect(sessionStorageMock.getItem('hubshop-auth')).toBe('authenticated');

    expect(localStorageMock.getItem('hubshop-auth')).toBeNull();
  });

  it('should clear the old storage when login persistence changes', () => {
    const service = createService();

    service.login(true);

    expect(localStorageMock.getItem('hubshop-auth')).toBe('authenticated');

    service.login(false);

    expect(localStorageMock.getItem('hubshop-auth')).toBeNull();

    expect(sessionStorageMock.getItem('hubshop-auth')).toBe('authenticated');
  });

  it('should remove authentication from both storages on logout', () => {
    localStorageMock.setItem('hubshop-auth', 'authenticated');

    sessionStorageMock.setItem('hubshop-auth', 'authenticated');

    const service = createService();

    expect(service.isAuthenticated()).toBe(true);

    service.logout();

    expect(service.isAuthenticated()).toBe(false);

    expect(localStorageMock.getItem('hubshop-auth')).toBeNull();

    expect(sessionStorageMock.getItem('hubshop-auth')).toBeNull();
  });

  it('should remain unauthenticated without browser storage', () => {
    const service = createService(null, null);

    service.login(true);

    expect(service.isAuthenticated()).toBe(false);

    service.login(false);

    expect(service.isAuthenticated()).toBe(false);
  });

  it('should allow logout without browser storage', () => {
    const service = createService(null, null);

    expect(() => service.logout()).not.toThrow();

    expect(service.isAuthenticated()).toBe(false);
  });
});
