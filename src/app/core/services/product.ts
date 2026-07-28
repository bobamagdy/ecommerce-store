import {
  httpResource
} from '@angular/common/http';

import {
  computed,
  Injectable
} from '@angular/core';

import {
  Product
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  /*
   * GET request تفاعلية باستخدام
   * Angular 22 httpResource.
   *
   * لاحقًا سنغير الرابط فقط إلى
   * .NET Products API.
   */
  private readonly productsResource =
    httpResource<Product[]>(
      () => '/data/products.json',

      {
        defaultValue: []
      }
    );

  /*
   * لا نقرأ value() إلا عندما تكون
   * للـResource قيمة صالحة.
   *
   * قراءة value أثناء Error State
   * قد ترمي Runtime Error.
   */
  readonly products = computed<Product[]>(
    () =>
      this.productsResource.hasValue()
        ? this.productsResource.value()
        : []
  );

  /*
   * Request state signals.
   */
  readonly isLoading =
    this.productsResource.isLoading;

  readonly error =
    this.productsResource.error;

  readonly status =
    this.productsResource.status;

  readonly statusCode =
    this.productsResource.statusCode;

  /*
   * Initial loading:
   *
   * لا توجد منتجات قديمة نعرضها.
   */
  readonly isInitialLoading =
    computed(
      () =>
        this.isLoading() &&
        this.products().length === 0
    );

  /*
   * Reloading:
   *
   * يوجد Data قديمة ونحضر نسخة جديدة.
   */
  readonly isReloading =
    computed(
      () =>
        this.status() === 'reloading'
    );

  /*
   * Error يمنع عرض صفحة المنتجات
   * فقط عندما لا توجد Data سابقة.
   */
  readonly hasBlockingError =
    computed(
      () =>
        this.error() !== undefined &&
        this.products().length === 0
    );

  readonly errorMessage =
    computed(() => {
      const currentError =
        this.error();

      if (!currentError) {
        return '';
      }

      return (
        currentError.message ||
        'Products could not be loaded.'
      );
    });

  getProductById(
    productId: number
  ): Product | undefined {
    return this.products().find(
      (product) =>
        product.id === productId
    );
  }

  reloadProducts(): boolean {
    return this.productsResource.reload();
  }
}