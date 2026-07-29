import { Directive, ElementRef, inject, input, Renderer2, signal } from '@angular/core';

const DEFAULT_FALLBACK_IMAGE = '/images/product-placeholder.svg';

@Directive({
  selector: 'img[appImageFallback]',

  host: {
    /*
     * نستمع إلى Error Event الخاص بالصورة.
     *
     * لو الصورة الأصلية فشلت، نستبدلها
     * بصورة الـFallback.
     */
    '(error)': 'handleImageError()',

    /*
     * نستمع إلى Load Event لنعرف هل الصورة
     * التي تم تحميلها أصلية أم Fallback.
     */
    '(load)': 'handleImageLoad()',

    /*
     * Host Attribute Binding.
     *
     * عند استخدام صورة الـFallback:
     *
     * data-fallback-active="true"
     */
    '[attr.data-fallback-active]': 'fallbackActive() ? "true" : null',

    /*
     * لو حتى صورة الـFallback نفسها فشلت:
     *
     * data-fallback-failed="true"
     */
    '[attr.data-fallback-failed]': 'fallbackFailed() ? "true" : null',
  },
})
export class ImageFallback {
  /*
   * ElementRef تمسك عنصر img الذي وُضعت
   * عليه الـDirective.
   */
  private readonly imageElement = inject<ElementRef<HTMLImageElement>>(ElementRef);

  /*
   * Renderer2 نستخدمها لتعديل خصائص
   * وAttributes العنصر.
   */
  private readonly renderer = inject(Renderer2);

  /*
   * Signal Input.
   *
   * يمكن تمرير صورة Fallback مختلفة:
   *
   * <img
   *   [appImageFallback]="customImage"
   * />
   */
  readonly appImageFallback = input(DEFAULT_FALLBACK_IMAGE);

  /*
   * هل الصورة الحالية هي صورة الـFallback؟
   */
  readonly fallbackActive = signal(false);

  /*
   * هل صورة الـFallback نفسها فشلت؟
   */
  readonly fallbackFailed = signal(false);

  handleImageError(): void {
    const image = this.imageElement.nativeElement;

    const fallbackSource = this.getFallbackSource();

    const currentSource = image.getAttribute('src') ?? '';

    /*
     * لو الـError حدث بالفعل لصورة الـFallback،
     * لا نضع نفس الصورة مرة ثانية حتى لا ندخل
     * في Infinite Error Loop.
     */
    if (currentSource === fallbackSource) {
      this.fallbackActive.set(true);
      this.fallbackFailed.set(true);

      this.renderer.setAttribute(image, 'aria-label', 'Product image is unavailable');

      return;
    }

    this.fallbackActive.set(true);
    this.fallbackFailed.set(false);

    /*
     * srcset وsizes ممكن يجبروا المتصفح
     * على محاولة تحميل الصورة القديمة مرة أخرى،
     * لذلك نحذفهم قبل وضع صورة الـFallback.
     */
    this.renderer.removeAttribute(image, 'srcset');

    this.renderer.removeAttribute(image, 'sizes');

    this.renderer.setAttribute(image, 'src', fallbackSource);
  }

  handleImageLoad(): void {
    const image = this.imageElement.nativeElement;

    const fallbackSource = this.getFallbackSource();

    const currentSource = image.getAttribute('src') ?? '';

    const isUsingFallback = currentSource === fallbackSource;

    this.fallbackActive.set(isUsingFallback);

    /*
     * لو صورة أصلية جديدة تم تحميلها بنجاح،
     * نمسح حالة الفشل القديمة.
     */
    if (!isUsingFallback) {
      this.fallbackFailed.set(false);

      this.renderer.removeAttribute(image, 'aria-label');
    }
  }

  private getFallbackSource(): string {
    const configuredFallback = this.appImageFallback().trim();

    return configuredFallback || DEFAULT_FALLBACK_IMAGE;
  }
}
