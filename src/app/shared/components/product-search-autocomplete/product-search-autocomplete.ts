import { CurrencyPipe } from '@angular/common';

import { OverlayModule } from '@angular/cdk/overlay';

import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';

import { Listbox, Option } from '@angular/aria/listbox';

import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Product } from '../../../core/models/product.model';

import { ProductService } from '../../../core/services/product/product';

@Component({
  selector: 'app-product-search-autocomplete',

  imports: [
    CurrencyPipe,
    FormsModule,
    OverlayModule,
    Combobox,
    ComboboxPopup,
    ComboboxWidget,
    Listbox,
    Option,
  ],

  templateUrl: './product-search-autocomplete.html',

  styleUrl: './product-search-autocomplete.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSearchAutocomplete {
  private readonly productService = inject(ProductService);

  /*
   * model() يسمح للـ Header باستخدام:
   *
   * [(query)]="searchQuery"
   *
   * وبالتالي القيمة تتحرك في الاتجاهين.
   */
  readonly query = model('');

  /*
   * أقصى عدد من المنتجات داخل الاقتراحات.
   */
  readonly maxResults = input(6);

  /*
   * المستخدم ضغط زر البحث
   * أو ضغط Enter بدون اختيار منتج.
   */
  readonly searchSubmitted = output<string>();

  /*
   * المستخدم اختار منتجًا من الاقتراحات.
   */
  readonly productSelected = output<Product>();

  /*
   * المستخدم مسح البحث.
   */
  readonly cleared = output<void>();

  readonly popupExpanded = signal(false);

  readonly selectedProductIds = signal<string[]>([]);

  readonly combobox = viewChild(Combobox);

  readonly listbox = viewChild(Listbox);

  readonly isInitialLoading = this.productService.isInitialLoading;

  readonly hasBlockingError = this.productService.hasBlockingError;

  readonly errorMessage = this.productService.errorMessage;

  private readonly normalizedQuery = computed(() => this.query().trim().toLowerCase());

  readonly canOpenPopup = computed(() => this.normalizedQuery().length > 0);

  /*
   * البحث يتم داخل:
   *
   * Product Name
   * Category
   * Brand
   * SKU
   */
  readonly filteredProducts = computed<Product[]>(() => {
    const query = this.normalizedQuery();

    if (!query) {
      return [];
    }

    const resultLimit = Math.max(1, this.maxResults());

    return this.productService
      .products()
      .filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query)
        );
      })
      .slice(0, resultLimit);
  });

  /*
   * رسالة يقرأها Screen Reader.
   */
  readonly resultAnnouncement = computed(() => {
    const query = this.query().trim();

    if (!query) {
      return '';
    }

    if (this.isInitialLoading()) {
      return 'Loading product suggestions.';
    }

    const resultCount = this.filteredProducts().length;

    if (resultCount === 0) {
      return `No products found for ${query}.`;
    }

    const resultLabel = resultCount === 1 ? 'product suggestion' : 'product suggestions';

    return `${resultCount} ${resultLabel} available.`;
  });

  constructor() {
    /*
     * عندما يتحرك المستخدم بالأسهم،
     * نحافظ على العنصر النشط ظاهرًا
     * داخل Scroll الخاص بالقائمة.
     */
    afterRenderEffect(() => {
      if (this.combobox()?.expanded() === true) {
        this.listbox()?.scrollActiveItemIntoView();
      }
    });
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.query.set(inputElement.value);

    this.selectedProductIds.set([]);

    if (inputElement.value.trim().length > 0) {
      this.popupExpanded.set(true);

      return;
    }

    this.popupExpanded.set(false);
  }

  openPopup(): void {
    if (!this.canOpenPopup()) {
      return;
    }

    this.popupExpanded.set(true);
  }

  closePopup(): void {
    this.popupExpanded.set(false);
  }

  clearSearch(): void {
    this.query.set('');

    this.selectedProductIds.set([]);

    this.popupExpanded.set(false);

    this.cleared.emit();

    this.combobox()?.element.focus();
  }

  submitSearch(): void {
    const normalizedQuery = this.query().trim();

    this.selectedProductIds.set([]);

    this.popupExpanded.set(false);

    this.searchSubmitted.emit(normalizedQuery);
  }

  /*
   * ننتظر حتى تنتهي Angular Aria
   * من تحديث العنصر المختار.
   *
   * لو فيه منتج مختار:
   * نفتح صفحة المنتج.
   *
   * لو مفيش:
   * ننفذ البحث العادي.
   */
  handleEnter(event: Event): void {
    event.preventDefault();

    queueMicrotask(() => {
      if (this.selectedProductIds().length > 0) {
        this.commitSelection();

        return;
      }

      this.submitSearch();
    });
  }

  commitSelection(): void {
    const selectedProductId = this.selectedProductIds()[0];

    if (selectedProductId === undefined) {
      return;
    }

    const selectedProduct = this.productService.getProductById(selectedProductId);

    if (!selectedProduct) {
      return;
    }

    this.popupExpanded.set(false);

    this.selectedProductIds.set([]);

    this.productSelected.emit(selectedProduct);
  }
}
