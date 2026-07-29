import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API configuration', {
  providedIn: 'root',

  factory: () => ({
    baseUrl: '/api',
  }),
});
