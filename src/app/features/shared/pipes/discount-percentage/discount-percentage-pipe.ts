import {
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({
  name: 'discountPercentage',
  standalone: true,
  pure: true
})
export class DiscountPercentagePipe
  implements PipeTransform {

  transform(
    currentPrice: number | null | undefined,
    oldPrice: number | null | undefined
  ): number | null {
    /*
     * نتأكد إن القيم أرقام صحيحة.
     */
    if (
      !Number.isFinite(currentPrice) ||
      !Number.isFinite(oldPrice)
    ) {
      return null;
    }

    const safeCurrentPrice =
      Number(currentPrice);

    const safeOldPrice =
      Number(oldPrice);

    /*
     * الحالات التي لا يوجد فيها خصم حقيقي.
     */
    if (
      safeCurrentPrice < 0 ||
      safeOldPrice <= 0 ||
      safeCurrentPrice >= safeOldPrice
    ) {
      return null;
    }

    const discount =
      (
        (
          safeOldPrice -
          safeCurrentPrice
        ) /
        safeOldPrice
      ) * 100;

    return Math.round(discount);
  }
}