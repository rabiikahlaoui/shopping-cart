import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { getPriceTtc } from '@shared/utils/tax.utils';
import {
  getLocalStorage,
  setLocalStorage,
} from '@shared/utils/local-storage.utils';
import { CartItem } from '@shared/models/cart-item.model';
import { Product } from '@shared/models/product.model';

const CART_STORAGE_KEY = 'shopping-cart-cart';

function productTtc(item: CartItem): number {
  return getPriceTtc(item.product) * item.quantity;
}

function productTax(item: CartItem): number {
  return (getPriceTtc(item.product) - item.product.price) * item.quantity;
}

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState({
    cartItems: getLocalStorage<CartItem[]>(CART_STORAGE_KEY, 'array', []),
  }),
  withComputed((store) => ({
    cartItemsCount: computed(() =>
      store.cartItems().reduce((sum, cartItem) => sum + cartItem.quantity, 0)
    ),
    cartTotalTaxes: computed(() =>
      store.cartItems().reduce((sum, cartItem) => sum + productTax(cartItem), 0)
    ),
    cartTotal: computed(() =>
      store.cartItems().reduce((sum, cartItem) => sum + productTtc(cartItem), 0)
    ),
  })),
  withMethods((store) => ({
    getQuantityInCart(productId: number): number {
      return store.cartItems().find((i) => i.product.id === productId)?.quantity ?? 0;
    },
    addItem(product: Product, quantity: number): void {
      const items = store.cartItems();
      const index = items.findIndex((item) => item.product.id === product.id);

      let next: CartItem[];
      if (index === -1) {
        next = [...items, { product, quantity }];
      } else {
        next = items.map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      patchState(store, { cartItems: next });
      setLocalStorage(CART_STORAGE_KEY, next);
    },
    removeItem(productId: number): void {
      const next = store.cartItems().filter((i) => i.product.id !== productId);
      patchState(store, { cartItems: next });
      setLocalStorage(CART_STORAGE_KEY, next);
    },
  }))
);
