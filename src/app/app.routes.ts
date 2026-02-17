import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'products',
    loadComponent: () => import('@domains/products/components/products-page/products-page').then((m) => m.ProductsPage),
  },
  {
    path: 'cart',
    loadComponent: () => import('@domains/cart/components/cart-page/cart-page').then((m) => m.CartPage),
  },
];
