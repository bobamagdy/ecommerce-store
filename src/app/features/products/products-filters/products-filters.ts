import { CurrencyPipe } from '@angular/common';

import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  DEFAULT_MAX_PRICE,
  FilterOption,
  FilterSelectionChange,
  MINIMUM_PRICE,
} from '../../../core/models/products-page.models';

@Component({
  selector: 'app-products-filters',

  imports: [
    CurrencyPipe,
    AccordionGroup,
    AccordionTrigger,
    AccordionPanel,
    AccordionContent,
  ],

  templateUrl: './products-filters.html',

  styleUrl: './products-filters.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsFilters {
  readonly categories =
    input.required<readonly FilterOption[]>();

  readonly brands =
    input.required<readonly FilterOption[]>();

  readonly selectedCategories =
    input.required<readonly string[]>();

  readonly selectedBrands =
    input.required<readonly string[]>();

  readonly searchQuery =
    input.required<string>();

  readonly maxPrice =
    input.required<number>();

  readonly hasActiveFilters =
    input.required<boolean>();

  readonly categoryChange =
    output<FilterSelectionChange>();

  readonly brandChange =
    output<FilterSelectionChange>();

  readonly maxPriceChange =
    output<number>();

  readonly clearSearch =
    output<void>();

  readonly resetFilters =
    output<void>();

  readonly minimumPrice = MINIMUM_PRICE;

  readonly maximumPrice = DEFAULT_MAX_PRICE;

  onCategoryChange(
    categoryName: string,
    event: Event,
  ): void {
    const checkbox =
      event.currentTarget as HTMLInputElement;

    this.categoryChange.emit({
      value: categoryName,
      checked: checkbox.checked,
    });
  }

  onBrandChange(
    brandName: string,
    event: Event,
  ): void {
    const checkbox =
      event.currentTarget as HTMLInputElement;

    this.brandChange.emit({
      value: brandName,
      checked: checkbox.checked,
    });
  }

  onMaxPriceInput(event: Event): void {
    const rangeInput =
      event.currentTarget as HTMLInputElement;

    this.maxPriceChange.emit(
      Number(rangeInput.value),
    );
  }
}