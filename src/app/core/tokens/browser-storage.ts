import {
  isPlatformBrowser
} from '@angular/common';

import {
  inject,
  InjectionToken,
  PLATFORM_ID
} from '@angular/core';

function isBrowserPlatform(): boolean {
  return isPlatformBrowser(
    inject(PLATFORM_ID)
  );
}

export const BROWSER_STORAGE =
  new InjectionToken<Storage | null>(
    'Browser Local Storage',
    {
      providedIn: 'root',

      factory: () => {
        if (!isBrowserPlatform()) {
          return null;
        }

        return localStorage;
      }
    }
  );

export const BROWSER_SESSION_STORAGE =
  new InjectionToken<Storage | null>(
    'Browser Session Storage',
    {
      providedIn: 'root',

      factory: () => {
        if (!isBrowserPlatform()) {
          return null;
        }

        return sessionStorage;
      }
    }
  );