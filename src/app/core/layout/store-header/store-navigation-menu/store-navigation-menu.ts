import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';

import { Menu, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';

import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';

import { Router } from '@angular/router';

type ShopMenuValue = 'all' | 'newest' | 'price-low' | 'rating';

type CategoryMenuValue = 'Electronics' | 'Fashion' | 'Beauty' | 'Home & Living' | 'Sports';

interface NavigationMenuItem<TValue extends string> {
  value: TValue;
  label: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-store-navigation-menu',

  imports: [OverlayModule, Menu, MenuContent, MenuItem, MenuTrigger],

  templateUrl: './store-navigation-menu.html',

  styleUrl: './store-navigation-menu.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreNavigationMenu {
  private readonly router = inject(Router);

  readonly shopMenu = viewChild<Menu<ShopMenuValue>>('shopMenu');

  readonly categoriesMenu = viewChild<Menu<CategoryMenuValue>>('categoriesMenu');

  readonly shopTrigger = viewChild<MenuTrigger<ShopMenuValue>>('shopTrigger');

  readonly categoriesTrigger = viewChild<MenuTrigger<CategoryMenuValue>>('categoriesTrigger');

  readonly menuPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 6,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 6,
    },
  ];

  readonly shopItems: readonly NavigationMenuItem<ShopMenuValue>[] = [
    {
      value: 'all',
      label: 'All Products',
      description: 'Browse the full catalog',
      icon: 'pi pi-th-large',
    },
    {
      value: 'newest',
      label: 'New Arrivals',
      description: 'See the latest products',
      icon: 'pi pi-sparkles',
    },
    {
      value: 'price-low',
      label: 'Best Deals',
      description: 'Start with lower prices',
      icon: 'pi pi-percentage',
    },
    {
      value: 'rating',
      label: 'Top Rated',
      description: 'Browse highest-rated products',
      icon: 'pi pi-star',
    },
  ];

  readonly categoryItems: readonly NavigationMenuItem<CategoryMenuValue>[] = [
    {
      value: 'Electronics',
      label: 'Electronics',
      description: 'Devices and smart technology',
      icon: 'pi pi-mobile',
    },
    {
      value: 'Fashion',
      label: 'Fashion',
      description: 'Clothing and accessories',
      icon: 'pi pi-shopping-bag',
    },
    {
      value: 'Beauty',
      label: 'Beauty',
      description: 'Perfume and personal care',
      icon: 'pi pi-heart',
    },
    {
      value: 'Home & Living',
      label: 'Home & Living',
      description: 'Furniture and home products',
      icon: 'pi pi-home',
    },
    {
      value: 'Sports',
      label: 'Sports',
      description: 'Sports and fitness products',
      icon: 'pi pi-bolt',
    },
  ];

  onShopItemSelected(selectedValue: ShopMenuValue): void {
    this.shopTrigger()?.close();

    switch (selectedValue) {
      case 'all':
        void this.router.navigate(['/products']);
        return;

      case 'newest':
        void this.router.navigate(['/products'], {
          queryParams: {
            sort: 'newest',
          },
        });
        return;

      case 'price-low':
        void this.router.navigate(['/products'], {
          queryParams: {
            sort: 'price-low',
          },
        });
        return;

      case 'rating':
        void this.router.navigate(['/products'], {
          queryParams: {
            sort: 'rating',
          },
        });
        return;
    }
  }

  onCategoryItemSelected(category: CategoryMenuValue): void {
    this.categoriesTrigger()?.close();

    void this.router.navigate(['/products'], {
      queryParams: {
        category,
      },
    });
  }
}
