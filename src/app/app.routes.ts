import { Routes } from '@angular/router';
import { CartPage } from './domains/cart/components/cart-page/cart-page';
import { ProductsPage } from './domains/products/components/products-page/products-page';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'products' },
    { path: 'products', component: ProductsPage },
    { path: 'cart', component: CartPage }
];
