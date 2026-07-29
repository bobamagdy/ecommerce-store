import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector: 'app-product-grid-skeleton',

  imports: [],

  templateUrl:
    './product-grid-skeleton.html',

  styleUrl:
    './product-grid-skeleton.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ProductGridSkeleton {
  readonly count = input(8);

  readonly listView = input(false);

  readonly skeletonItems = computed(
    () => {
      const safeCount = Math.max(
        Math.trunc(this.count()),
        1
      );

      return Array.from(
        {
          length: safeCount
        },
        (_item, index) => index
      );
    }
  );
}