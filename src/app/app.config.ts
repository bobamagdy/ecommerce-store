import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';

import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideAppHttp } from './core/http/provide-app-http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
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
      license:
        'eyJpZCI6IjNmYWY3MWIzLWM4M2QtNDdlOC04ZjdhLTlhODEwNDBhZTVlZSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODUxNjY5NDksImV4cCI6MTgxNjcwMjk0OX0.KVPaDQtbqFWVkKtPyCwScuiNYmXowqfSJqyDN0nM3kFJDAwvh67HVekk6kRIIdrcMzOS0Z4X0apMTsbf6Ge3Bg',
      theme: {
        preset: Aura,
      },
      ripple: true,
    }),
  ],
};
