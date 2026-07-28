import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model
} from '@angular/core';

@Component({
  selector: 'app-quantity-selector',

  imports: [],

  templateUrl: './quantity-selector.html',
  styleUrl: './quantity-selector.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class QuantitySelector {
  /*
   * Model Input إجبارية.
   *
   * تستقبل quantity من الـParent،
   * وعند تغييرها ترسل quantityChange تلقائيًا.
   */
  readonly quantity =
    model.required<number>();

  /*
   * أقل قيمة مسموحة.
   *
   * في Cart وProduct Card ستكون 0،
   * وبالتالي النزول من 1 إلى 0 يعني الحذف.
   */
  readonly min = input(0);

  /*
   * أقصى قيمة مسموحة.
   *
   * لا يمكن استخدام الـComponent
   * بدون تحديد الحد الأقصى.
   */
  readonly max =
    input.required<number>();

  readonly label =
    input('In Cart');

  readonly canDecrease = computed(
    () => this.quantity() > this.min()
  );

  readonly canIncrease = computed(
    () => this.quantity() < this.max()
  );

  readonly decreaseIcon = computed(
    () =>
      this.quantity() ===
      this.min() + 1
        ? 'pi-trash'
        : 'pi-minus'
  );

  decrease(): void {
    if (!this.canDecrease()) {
      return;
    }

    this.quantity.update(
      (currentQuantity) =>
        Math.max(
          currentQuantity - 1,
          this.min()
        )
    );
  }

  increase(): void {
    if (!this.canIncrease()) {
      return;
    }

    this.quantity.update(
      (currentQuantity) =>
        Math.min(
          currentQuantity + 1,
          this.max()
        )
    );
  }
}