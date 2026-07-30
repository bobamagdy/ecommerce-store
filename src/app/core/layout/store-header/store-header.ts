import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';

import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { debounceTime, distinctUntilChanged, map, skip } from 'rxjs';

import { ProductSearchAutocomplete } from '../../../shared/components/product-search-autocomplete/product-search-autocomplete';
import { Product } from '../../models/product.model';

import { CartService } from '../../services/cart/cart';

import { WishlistService } from '../../services/wishlist/wishlist';

@Component({
  selector: 'app-store-header',

  imports: [ProductSearchAutocomplete, RouterLink, RouterLinkActive],

  templateUrl: './store-header.html',

  styleUrl: './store-header.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreHeader {
  private readonly cartService = inject(CartService);

  private readonly wishlistService = inject(WishlistService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  readonly wishlistCount = this.wishlistService.totalItems;

  readonly cartCount = this.cartService.totalQuantity;

  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  private readonly routeSearchQuery = computed(() => this.queryParamMap().get('q')?.trim() ?? '');

  readonly searchQuery = linkedSignal(() => this.routeSearchQuery());

  constructor() {
    toObservable(this.searchQuery)
      .pipe(
        map((query) => query.trim()),

        debounceTime(400),

        distinctUntilChanged(),

        skip(1),

        takeUntilDestroyed(),
      )
      .subscribe((query) => {
        /*
         * الـLive Search يعمل فقط
         * ونحن داخل Products Page.
         *
         * في باقي الصفحات تظهر الاقتراحات،
         * لكن الانتقال لا يحدث إلا عند Submit.
         */
        const currentPath = this.router.url.split('?')[0];

        if (currentPath !== '/products') {
          return;
        }

        this.navigateToSearch(query, true);
      });
  }

  submitSearch(query: string): void {
    this.searchQuery.set(query);

    this.navigateToSearch(query, false);
  }

  clearSearch(): void {
    this.searchQuery.set('');

    const currentPath = this.router.url.split('?')[0];

    if (currentPath !== '/products') {
      return;
    }

    this.navigateToSearch('', false);
  }

  openProduct(product: Product): void {
    void this.router.navigate(['/products', product.id]);
  }

  private navigateToSearch(query: string, replaceUrl: boolean): void {
    const normalizedQuery = query.trim();

    const currentPath = this.router.url.split('?')[0];

    const isProductsPage = currentPath === '/products';

    void this.router.navigate(['/products'], {
      queryParams: {
        q: normalizedQuery.length > 0 ? normalizedQuery : null,
      },

      queryParamsHandling: isProductsPage ? 'merge' : undefined,

      replaceUrl,
    });
  }
}
