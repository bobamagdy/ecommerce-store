import {
  HttpClient,
  HttpContext,
  HttpErrorResponse
} from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import {
  TestBed
} from '@angular/core/testing';

import {
  firstValueFrom
} from 'rxjs';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it
} from 'vitest';

import {
  ApiErrorService
} from '../../services/api-error/api-error';

import {
  LoadingService
} from '../../services/loading/loading';

import {
  provideAppHttp
} from '../provide-app-http';

import {
  SKIP_GLOBAL_ERROR,
  SKIP_GLOBAL_LOADING
} from '../http-context-tokens';

describe(
  'HTTP interceptors',
  () => {
    let httpClient:
      HttpClient;

    let httpTesting:
      HttpTestingController;

    let loadingService:
      LoadingService;

    let apiErrorService:
      ApiErrorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideAppHttp(),

          /*
           * لازم Testing Backend
           * تأتي بعد provideHttpClient.
           */
          provideHttpClientTesting()
        ]
      });

      httpClient =
        TestBed.inject(HttpClient);

      httpTesting =
        TestBed.inject(
          HttpTestingController
        );

      loadingService =
        TestBed.inject(
          LoadingService
        );

      apiErrorService =
        TestBed.inject(
          ApiErrorService
        );
    });

    afterEach(() => {
      httpTesting.verify();

      TestBed.resetTestingModule();
    });

    it(
      'should prefix api requests with the configured base URL',
      async () => {
        const responsePromise =
          firstValueFrom(
            httpClient.get(
              'api/products'
            )
          );

        const request =
          httpTesting.expectOne(
            '/api/products'
          );

        expect(
          request.request.method
        ).toBe('GET');

        request.flush([]);

        await responsePromise;
      }
    );

    it(
      'should not change asset request URLs',
      async () => {
        const responsePromise =
          firstValueFrom(
            httpClient.get(
              '/data/products.json'
            )
          );

        const request =
          httpTesting.expectOne(
            '/data/products.json'
          );

        request.flush([]);

        await responsePromise;
      }
    );

    it(
      'should expose loading state while a request is pending',
      async () => {
        const responsePromise =
          firstValueFrom(
            httpClient.get(
              '/data/products.json'
            )
          );

        expect(
          loadingService.isLoading()
        ).toBe(true);

        expect(
          loadingService
            .pendingRequests()
        ).toBe(1);

        const request =
          httpTesting.expectOne(
            '/data/products.json'
          );

        request.flush([]);

        await responsePromise;

        expect(
          loadingService.isLoading()
        ).toBe(false);

        expect(
          loadingService
            .pendingRequests()
        ).toBe(0);
      }
    );

    it(
      'should support skipping global loading',
      async () => {
        const requestContext =
          new HttpContext().set(
            SKIP_GLOBAL_LOADING,
            true
          );

        const responsePromise =
          firstValueFrom(
            httpClient.get(
              '/health',
              {
                context:
                  requestContext
              }
            )
          );

        expect(
          loadingService.isLoading()
        ).toBe(false);

        const request =
          httpTesting.expectOne(
            '/health'
          );

        request.flush({
          status: 'healthy'
        });

        await responsePromise;
      }
    );

    it(
      'should report HTTP errors globally',
      async () => {
        const responsePromise =
          firstValueFrom(
            httpClient.get(
              'api/orders'
            )
          );

        const request =
          httpTesting.expectOne(
            '/api/orders'
          );

        request.flush(
          {
            message:
              'Orders could not be loaded.'
          },
          {
            status: 500,
            statusText:
              'Internal Server Error'
          }
        );

        await expect(
          responsePromise
        ).rejects.toBeInstanceOf(
          HttpErrorResponse
        );

        expect(
          apiErrorService.message()
        ).toBe(
          'Orders could not be loaded.'
        );

        expect(
          loadingService.isLoading()
        ).toBe(false);
      }
    );

    it(
      'should support skipping global error reporting',
      async () => {
        const requestContext =
          new HttpContext().set(
            SKIP_GLOBAL_ERROR,
            true
          );

        const responsePromise =
          firstValueFrom(
            httpClient.get(
              '/silent-request',
              {
                context:
                  requestContext
              }
            )
          );

        const request =
          httpTesting.expectOne(
            '/silent-request'
          );

        request.flush(
          null,
          {
            status: 404,
            statusText:
              'Not Found'
          }
        );

        await expect(
          responsePromise
        ).rejects.toBeInstanceOf(
          HttpErrorResponse
        );

        expect(
          apiErrorService.message()
        ).toBeNull();
      }
    );
  }
);