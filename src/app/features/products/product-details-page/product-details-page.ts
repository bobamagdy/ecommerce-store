import {
  CurrencyPipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  numberAttribute
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  ButtonModule
} from 'primeng/button';

import {
  CartService
} from '../../../core/services/cart';

import {
  ProductService
} from '../../../core/services/product';

/*
 * Input Transform.
 *
 * الـRouter يرسل Route Parameter
 * في صورة string.
 *
 * الدالة تحول القيمة إلى number
 * صالح للاستخدام داخل الصفحة.
 */
function transformProductId(
  value: string | null | undefined
): number {
  const productId =
    numberAttribute(value);

  if (
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    return 0;
  }

  return productId;
}

@Component({
  selector: 'app-product-details-page',

  imports: [
    CurrencyPipe,
    RouterLink,
    ButtonModule
  ],

  templateUrl:
    './product-details-page.html',

  styleUrl:
    './product-details-page.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ProductDetailsPage {
  private readonly productService =
    inject(ProductService);

  private readonly cartService =
    inject(CartService);

  /*
   * اسم الـInput هو id.
   *
   * لذلك Angular Router يربطها
   * تلقائيًا مع:
   *
   * products/:id
   *
   * القيمة القادمة من الرابط string،
   * والـTransform يحولها إلى number.
   */
  readonly id =
    input.required<
      number,
      string | null | undefined
    >({
      transform:
        transformProductId
    });

  /*
   * Signal مشتقة من Router Input.
   *
   * لو id تغيرت من الرابط،
   * المنتج يتغير تلقائيًا.
   */
  readonly product =
    computed(() =>
      this.productService
        .getProductById(this.id())
    );

  /*
   * selectedImage حالة قابلة للتعديل،
   * لكنها مرتبطة بالمنتج الحالي.
   *
   * عند فتح منتج مختلف،
   * ترجع تلقائيًا للصورة الأساسية.
   */
  readonly selectedImage =
    linkedSignal(
      () =>
        this.product()?.image ?? ''
    );

  /*
   * الكمية ترجع إلى 1 عند تغيير المنتج.
   *
   * لو المنتج غير موجود أو Stock = 0
   * تكون الكمية 0.
   */
  readonly quantity =
  linkedSignal<number>(() => {
      const currentProduct =
        this.product();

      if (
        !currentProduct ||
        currentProduct.stock <= 0
      ) {
        return 0;
      }

      return 1;
    });

  /*
   * بدل Signal مؤقتة تقول إن المنتج
   * اتضاف، بنقرأ الحالة الحقيقية
   * من CartService.
   */
  readonly addedToCart =
    computed(() => {
      const currentProduct =
        this.product();

      if (!currentProduct) {
        return false;
      }

      return (
        this.cartService
          .getProductQuantity(
            currentProduct.id
          ) > 0
      );
    });

  selectImage(
    image: string
  ): void {
    this.selectedImage.set(image);
  }

  increaseQuantity(): void {
    const currentProduct =
      this.product();

    if (
      !currentProduct ||
      currentProduct.stock <= 0
    ) {
      return;
    }

    this.quantity.update(
      (currentQuantity) =>
        Math.min(
          currentQuantity + 1,
          currentProduct.stock
        )
    );
  }

  decreaseQuantity(): void {
    const currentProduct =
      this.product();

    if (
      !currentProduct ||
      currentProduct.stock <= 0
    ) {
      return;
    }

    this.quantity.update(
      (currentQuantity) =>
        Math.max(
          currentQuantity - 1,
          1
        )
    );
  }

  addToCart(): void {
    const currentProduct =
      this.product();

    const selectedQuantity =
      this.quantity();

    if (
      !currentProduct ||
      currentProduct.stock <= 0 ||
      selectedQuantity <= 0
    ) {
      return;
    }

    this.cartService.addProduct(
      currentProduct,
      selectedQuantity
    );
  }
}