import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal
} from '@angular/core';

import {
  takeUntilDestroyed,
  toObservable,
  toSignal
} from '@angular/core/rxjs-interop';

import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  debounceTime,
  distinctUntilChanged,
  map,
  skip
} from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { CartService } from '../../services/cart/cart';
import { WishlistService } from '../../services/wishlist/wishlist';

@Component({
  selector: 'app-store-header',

  imports: [
    ButtonModule,
    InputTextModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './store-header.html',
  styleUrl: './store-header.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class StoreHeader {
  private readonly cartService =
    inject(CartService);

  private readonly wishlistService =
    inject(WishlistService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  readonly wishlistCount =
    this.wishlistService.totalItems;

  readonly cartCount =
    this.cartService.totalQuantity;

  /*
   * نحول queryParamMap من Observable إلى Signal.
   *
   * initialValue تمنع وجود undefined
   * قبل أول قيمة من الـRouter.
   */
  private readonly queryParamMap =
    toSignal(
      this.route.queryParamMap,
      {
        initialValue:
          this.route.snapshot.queryParamMap
      }
    );

  /*
   * قيمة البحث الموجودة حاليًا داخل الرابط.
   */
  private readonly routeSearchQuery =
    computed(
      () =>
        this.queryParamMap()
          .get('q')
          ?.trim() ?? ''
    );

  /*
   * linkedSignal:
   *
   * تتزامن مع قيمة q الموجودة في الرابط،
   * لكنها تظل Writable أثناء الكتابة.
   */
  readonly searchQuery =
    linkedSignal(
      () => this.routeSearchQuery()
    );

  constructor() {
    /*
     * تحويل Signal البحث إلى Observable.
     *
     * debounceTime:
     * ننتظر 400ms بعد آخر حرف.
     *
     * distinctUntilChanged:
     * لا ننفذ Navigation لنفس القيمة مرتين.
     *
     * skip(1):
     * نتجاهل القيمة الأولى عند إنشاء الـHeader.
     */
    toObservable(this.searchQuery)
      .pipe(
        map((query) => query.trim()),

        debounceTime(400),

        distinctUntilChanged(),

        skip(1),

        takeUntilDestroyed()
      )
      .subscribe((query) => {
        this.navigateToSearch(
          query,
          true
        );
      });
  }

  updateSearchQuery(
    event: Event
  ): void {
    const inputElement =
      event.target as HTMLInputElement;

    this.searchQuery.set(
      inputElement.value
    );
  }

  submitSearch(
    event: SubmitEvent
  ): void {
    event.preventDefault();

    this.navigateToSearch(
      this.searchQuery(),
      false
    );
  }

  clearSearch(): void {
    this.searchQuery.set('');

    this.navigateToSearch(
      '',
      false
    );
  }

  private navigateToSearch(
    query: string,
    replaceUrl: boolean
  ): void {
    const normalizedQuery =
      query.trim();

    const currentPath =
      this.router.url.split('?')[0];

    const isProductsPage =
      currentPath === '/products';

    /*
     * لو إحنا بالفعل داخل Products:
     * نحافظ على باقي الفلاتر.
     *
     * لو جايين من صفحة أخرى:
     * نبدأ Search جديدة بدون فلاتر قديمة.
     */
    void this.router.navigate(
      ['/products'],
      {
        queryParams: {
          q:
            normalizedQuery.length > 0
              ? normalizedQuery
              : null
        },

        queryParamsHandling:
          isProductsPage
            ? 'merge'
            : undefined,

        replaceUrl
      }
    );
  }
}