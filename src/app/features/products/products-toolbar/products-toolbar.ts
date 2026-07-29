import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProductsView, SORT_OPTIONS, SortOption } from '../../../core/models/products-page.models';

@Component({
  selector: 'app-products-toolbar',

  templateUrl: './products-toolbar.html',
  styleUrl: './products-toolbar.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsToolbar {
  readonly displayedCount = input.required<number>();

  readonly totalCount = input.required<number>();

  readonly sortBy = input.required<SortOption>();

  readonly view = input.required<ProductsView>();

  readonly sortChange = output<SortOption>();

  readonly viewChange = output<ProductsView>();

  readonly gridView = () => this.view() === 'grid';

  onSortChange(event: Event): void {
    const selectElement = event.currentTarget as HTMLSelectElement;

    const selectedSort = selectElement.value;

    if (SORT_OPTIONS.includes(selectedSort as SortOption)) {
      this.sortChange.emit(selectedSort as SortOption);
    }
  }
}
