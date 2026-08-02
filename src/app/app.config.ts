import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { environment } from '../environments/environment';
import { APP_ENVIRONMENT } from './core/tokens/app-environment.token';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideAppHttp } from './core/http/provide-app-http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { PRIMEUI_LICENSE_KEY } from './core/config/primeui-license.generated';
import { routes } from './app.routes';
import { API_CONFIG } from './core/tokens/api-config';
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_ENVIRONMENT, useValue: environment },
    {
      provide: API_CONFIG,

      useValue: {
        baseUrl: environment.apiBaseUrl,
      },
    },
    provideBrowserGlobalErrorListeners(),

    provideZonelessChangeDetection(),

    provideRouter(
      routes,

      withComponentInputBinding(),

      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
    provideAppHttp(),
    providePrimeNG({
      license: PRIMEUI_LICENSE_KEY,
      theme: {
        preset: Aura,
      },
      ripple: true,
    }),
  ],
};
