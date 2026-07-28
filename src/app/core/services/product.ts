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
   * httpResource تنفذ GET request فور إنشاء
   * الـService، وتدير القيمة والتحميل والخطأ
   * في صورة Signals.
   *
   * لاحقًا سنستبدل المسار فقط بـ:
   *
   * http://localhost:5000/api/products
   */

  private readonly productsResource =
    httpResource<Product[]>(
      () => '/data/products.json',

      {
        defaultValue: []
      }
    );

  /*
   * نحافظ على نفس الـAPI التي تستخدمها
   * بقية الصفحات:
   *
   * productService.products()
   *
   * ونستخدم hasValue قبل قراءة value
   * حتى لا نحاول قراءة قيمة في حالة الخطأ.
   */

  readonly products = computed<Product[]>(
    () =>
      this.productsResource.hasValue()
        ? this.productsResource.value()
        : []
  );

  /*
   * Signals خاصة بحالة الـRequest.
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
   * البحث عن منتج سيظل يعمل كما كان.
   *
   * لأن products() أصبحت تعتمد على
   * httpResource وتتحدث تلقائيًا بعد
   * وصول البيانات.
   */

  getProductById(
    productId: number
  ): Product | undefined {
    return this.products().find(
      (product) =>
        product.id === productId
    );
  }

  /*
   * إعادة تحميل المنتجات بدون Refresh
   * للتطبيق كله.
   */

  reloadProducts(): void {
    this.productsResource.reload();
  }
}