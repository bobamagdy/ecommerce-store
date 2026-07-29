import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    title: 'HubShop Admin | Dashboard',
    loadComponent: () =>
      import('./dashboard/admin-dashboard/admin-dashboard').then(
        ({ AdminDashboard }) => AdminDashboard,
      ),
  },
  {
    path: 'products',
    title: 'HubShop Admin | Products',
    loadComponent: () =>
      import('./products/admin-products/admin-products').then(({ AdminProducts }) => AdminProducts),
  },
  {
    path: 'orders',
    title: 'HubShop Admin | Orders',
    loadComponent: () =>
      import('./orders/admin-orders/admin-orders').then(({ AdminOrders }) => AdminOrders),
  },
];
