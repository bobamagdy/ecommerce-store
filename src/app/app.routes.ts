import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard/auth-guard';

import { guestGuard } from './core/guards/guest-guard/guest-guard-guard';

import { pendingChangesGuard } from './core/guards/pending-changes-guard/pending-changes-guard-guard';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
export const routes: Routes = [
  /*
   * Legacy authentication URLs.
   */

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

  /*
   * Authentication Area.
   */

  {
    path: 'auth',

    loadComponent: () =>
      import('./core/layout/auth-layout/auth-layout').then(({ AuthLayout }) => AuthLayout),

    children: [
      {
        path: 'forgot-password',

        title: 'HubShop | Forgot Password',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./features/auth/forgot-password-page/forgot-password-page').then(
            ({ ForgotPasswordPage }) => ForgotPasswordPage,
          ),
      },

      {
        path: 'reset-password/:token',

        title: 'HubShop | Reset Password',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./features/auth/reset-password-page/reset-password-page').then(
            ({ ResetPasswordPage }) => ResetPasswordPage,
          ),
      },
      {
        path: 'login',

        title: 'HubShop | Login',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./features/auth/login-page/login-page').then(({ LoginPage }) => LoginPage),
      },

      {
        path: 'register',

        title: 'HubShop | Register',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./features/auth/register-page/register-page').then(
            ({ RegisterPage }) => RegisterPage,
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
    path: 'admin',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout').then(({ AdminLayout }) => AdminLayout),

    children: ADMIN_ROUTES,
  },
  /*
   * Store Area.
   */

  {
    path: '',

    loadComponent: () =>
      import('./core/layout/store-layout/store-layout').then(({ StoreLayout }) => StoreLayout),

    children: [
      /*
       * Public Routes.
       */

      {
        path: '',

        title: 'HubShop | Home',

        loadComponent: () =>
          import('./features/home/home-page/home-page').then(({ HomePage }) => HomePage),
      },

      {
        path: 'products',

        title: 'HubShop | Products',

        loadComponent: () =>
          import('./features/products/products-page/products-page').then(
            ({ ProductsPage }) => ProductsPage,
          ),
      },

      {
        path: 'products/:id',

        title: 'HubShop | Product Details',

        loadComponent: () =>
          import('./features/products/product-details-page/product-details-page').then(
            ({ ProductDetailsPage }) => ProductDetailsPage,
          ),
      },

      {
        path: 'wishlist',

        title: 'HubShop | Wishlist',

        loadComponent: () =>
          import('./features/wishlist/wishlist-page/wishlist-page').then(
            ({ WishlistPage }) => WishlistPage,
          ),
      },

      {
        path: 'cart',

        title: 'HubShop | Cart',

        loadComponent: () =>
          import('./features/cart/cart-page/cart-page').then(({ CartPage }) => CartPage),
      },

      /*
       * Protected Routes.
       */

      {
        path: 'checkout',

        title: 'HubShop | Checkout',

        canActivate: [authGuard],

        canDeactivate: [pendingChangesGuard],

        loadComponent: () =>
          import('./features/checkout/checkout-page/checkout-page').then(
            ({ CheckoutPage }) => CheckoutPage,
          ),
      },

      {
        path: 'account/orders',

        title: 'HubShop | My Orders',

        canActivate: [authGuard],

        loadComponent: () =>
          import('./features/account/orders-page/orders-page').then(({ OrdersPage }) => OrdersPage),
      },

      {
        path: 'account',

        title: 'HubShop | My Account',

        canActivate: [authGuard],

        loadComponent: () =>
          import('./features/account/account-page/account-page').then(
            ({ AccountPage }) => AccountPage,
          ),
      },
    ],
  },

  /*
   * Not Found.
   */

  {
    path: 'not-found',

    title: 'HubShop | Page Not Found',

    loadComponent: () =>
      import('./features/not-found/not-found-page/not-found-page').then(
        ({ NotFoundPage }) => NotFoundPage,
      ),
  },

  {
    path: '**',

    redirectTo: 'not-found',
  },
];
