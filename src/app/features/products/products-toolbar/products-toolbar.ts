import { Toolbar, ToolbarWidget, ToolbarWidgetGroup } from '@angular/aria/toolbar';

import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';

import { ProductsView, SortOption } from '../../../core/models/products-page.models';

import { ProductSortSelect } from '../product-sort-select/product-sort-select';

@Component({
  selector: 'app-products-toolbar',

  imports: [ProductSortSelect, Toolbar, ToolbarWidget, ToolbarWidgetGroup],

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

  readonly selectedViews = linkedSignal((): ProductsView[] => [this.view()]);

  onSelectedViewsChange(selectedViews: ProductsView[]): void {
    const selectedView = selectedViews[0];

    if (!selectedView) {
      return;
    }

    this.selectedViews.set([selectedView]);

    if (selectedView === this.view()) {
      return;
    }

    this.viewChange.emit(selectedView);
  }
}
