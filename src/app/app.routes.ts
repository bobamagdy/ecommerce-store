import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: 'register',
    redirectTo: 'auth/register',
    pathMatch: 'full',
  },

  {
    path: 'auth',

    loadComponent: () =>
      import('./core/layout/auth-layout/auth-layout').then((component) => component.AuthLayout),

    children: [
      {
        path: 'login',
        title: 'HubShop | Login',

        loadComponent: () =>
          import('./features/auth/login-page/login-page').then((component) => component.LoginPage),
      },

      {
        path: 'register',
        title: 'HubShop | Register',

        loadComponent: () =>
          import('./features/auth/register-page/register-page').then(
            (component) => component.RegisterPage,
          ),
      },

      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./core/layout/store-layout/store-layout').then((component) => component.StoreLayout),

    children: [
      {
        path: '',
        title: 'HubShop | Home',

        loadComponent: () =>
          import('./features/home/home-page/home-page').then((component) => component.HomePage),
      },
      {
        path: 'wishlist',
        title: 'HubShop | Wishlist',

        loadComponent: () =>
          import('./features/wishlist/wishlist-page/wishlist-page').then(
            (component) => component.WishlistPage,
          ),
      },
      {
        path: 'products',
        title: 'HubShop | Products',

        loadComponent: () =>
          import('./features/products/products-page/products-page').then(
            (component) => component.ProductsPage,
          ),
      },

      {
        path: 'products/:id',
        title: 'HubShop | Product Details',

        loadComponent: () =>
          import('./features/products/product-details-page/product-details-page').then(
            (component) => component.ProductDetailsPage,
          ),
      },

      {
        path: 'cart',
        title: 'HubShop | Cart',

        loadComponent: () =>
          import('./features/cart/cart-page/cart-page').then((component) => component.CartPage),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
