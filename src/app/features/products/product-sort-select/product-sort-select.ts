import { OverlayModule } from '@angular/cdk/overlay';

import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';

import { Listbox, Option } from '@angular/aria/listbox';

import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { SORT_OPTIONS, SortOption } from '../../../core/models/products-page.models';

interface ProductSortItem {
  value: SortOption;
  label: string;
}

@Component({
  selector: 'app-product-sort-select',

  imports: [OverlayModule, Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option],

  templateUrl: './product-sort-select.html',

  styleUrl: './product-sort-select.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSortSelect {
  readonly value = input.required<SortOption>();

  readonly valueChange = output<SortOption>();

  readonly popupExpanded = signal(false);

  readonly listbox = viewChild(Listbox);

  readonly options: readonly ProductSortItem[] = [
    {
      value: 'newest',
      label: 'Newest First',
    },
    {
      value: 'price-low',
      label: 'Price: Low to High',
    },
    {
      value: 'price-high',
      label: 'Price: High to Low',
    },
    {
      value: 'rating',
      label: 'Highest Rated',
    },
  ];

  /*
   * Angular Aria Listbox expects an array,
   * even though this component allows one selection.
   *
   * linkedSignal keeps the internal selection synchronized
   * whenever the parent changes the sort query parameter.
   */
  readonly selectedValues = linkedSignal(() => [this.value()]);

  readonly selectedLabel = computed(() => {
    const selectedValue = this.selectedValues()[0];

    return this.options.find((option) => option.value === selectedValue)?.label ?? 'Newest First';
  });

  constructor() {
    afterRenderEffect(() => {
      if (this.popupExpanded()) {
        this.listbox()?.scrollActiveItemIntoView();
      }
    });
  }

  commitSelection(): void {
    const selectedValue = this.selectedValues()[0];

    if (!selectedValue || !SORT_OPTIONS.includes(selectedValue)) {
      return;
    }

    this.popupExpanded.set(false);

    this.valueChange.emit(selectedValue);
  }

  closePopup(): void {
    this.popupExpanded.set(false);
  }
}
