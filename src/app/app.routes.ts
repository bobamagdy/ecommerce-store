import {
  Routes
} from '@angular/router';

import {
  authGuard
} from './core/guards/auth-guard';

export const routes: Routes = [
  /*
   * Legacy shortcuts.
   */

  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  {
    path: 'register',
    redirectTo: 'auth/register',
    pathMatch: 'full'
  },

  /*
   * Authentication routes.
   */

  {
    path: 'auth',

    loadComponent: () =>
      import(
        './core/layout/auth-layout/auth-layout'
      ).then(
        ({ AuthLayout }) =>
          AuthLayout
      ),

    children: [
      {
        path: 'login',

        title: 'HubShop | Login',

        loadComponent: () =>
          import(
            './features/auth/login-page/login-page'
          ).then(
            ({ LoginPage }) =>
              LoginPage
          )
      },

      {
        path: 'register',

        title: 'HubShop | Register',

        loadComponent: () =>
          import(
            './features/auth/register-page/register-page'
          ).then(
            ({ RegisterPage }) =>
              RegisterPage
          )
      },

      {
        path: '',

        redirectTo: 'login',

        pathMatch: 'full'
      }
    ]
  },

  /*
   * Store routes.
   *
   * هنحافظ مؤقتًا على authGuard
   * كما هو موجود في مشروعك.
   */

  {
    path: '',

    canActivate: [
      authGuard
    ],

    loadComponent: () =>
      import(
        './core/layout/store-layout/store-layout'
      ).then(
        ({ StoreLayout }) =>
          StoreLayout
      ),

    children: [
      {
        path: '',

        title: 'HubShop | Home',

        loadComponent: () =>
          import(
            './features/home/home-page/home-page'
          ).then(
            ({ HomePage }) =>
              HomePage
          )
      },

      {
        path: 'products',

        title: 'HubShop | Products',

        loadComponent: () =>
          import(
            './features/products/products-page/products-page'
          ).then(
            ({ ProductsPage }) =>
              ProductsPage
          )
      },

      {
        path: 'products/:id',

        title:
          'HubShop | Product Details',

        loadComponent: () =>
          import(
            './features/products/product-details-page/product-details-page'
          ).then(
            ({ ProductDetailsPage }) =>
              ProductDetailsPage
          )
      },

      {
        path: 'wishlist',

        title: 'HubShop | Wishlist',

        loadComponent: () =>
          import(
            './features/wishlist/wishlist-page/wishlist-page'
          ).then(
            ({ WishlistPage }) =>
              WishlistPage
          )
      },

      {
        path: 'cart',

        title: 'HubShop | Cart',

        loadComponent: () =>
          import(
            './features/cart/cart-page/cart-page'
          ).then(
            ({ CartPage }) =>
              CartPage
          )
      }
    ]
  },

  /*
   * Page not found.
   */

  {
    path: 'not-found',

    title: 'HubShop | Page Not Found',

    loadComponent: () =>
      import(
        './features/not-found/not-found-page/not-found-page'
      ).then(
        ({ NotFoundPage }) =>
          NotFoundPage
      )
  },

  /*
   * Wildcard لازم تكون آخر Route.
   */

  {
    path: '**',

    redirectTo: 'not-found'
  }
];