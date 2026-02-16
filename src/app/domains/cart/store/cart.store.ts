import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CartItem } from '../model/cart-item.model';
import { Product } from '../../products/model/product.model';
import { getPriceTtc } from '../../../shared/utils/tax.utils';

function lineTtc(item: CartItem): number {
  return getPriceTtc(item.product) * item.quantity;
}

function lineTax(item: CartItem): number {
  return (getPriceTtc(item.product) - item.product.price) * item.quantity;
}

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState({ cartItems: [] as CartItem[] }),
  withComputed((store) => ({
    cartItemsCount: computed(() =>
      store.cartItems().reduce((sum, item) => sum + item.quantity, 0)
    ),
    cartTotalTaxes: computed(() =>
      store.cartItems().reduce((sum, item) => sum + lineTax(item), 0)
    ),
    cartTotal: computed(() =>
      store.cartItems().reduce((sum, item) => sum + lineTtc(item), 0)
    ),
  })),
  withMethods((store) => ({
    getQuantityInCart(productId: number): number {
      return store.cartItems().find((i) => i.product.id === productId)?.quantity ?? 0;
    },
    addItem(product: Product, quantity: number): void {
      const current = store.cartItems();
      const idx = current.findIndex((item) => item.product.id === product.id);
      const next =
        idx >= 0
          ? current.map((item, i) =>
              i === idx ? { ...item, quantity: item.quantity + quantity } : item
            )
          : [...current, { product, quantity }];
      patchState(store, { cartItems: next });
    },
    removeItem(productId: number): void {
      patchState(store, {
        cartItems: store.cartItems().filter((i) => i.product.id !== productId),
      });
    },
  }))
);
