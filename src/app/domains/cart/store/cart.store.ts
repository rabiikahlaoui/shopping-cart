import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { getPriceTtc } from '@shared/utils/tax.utils';
import { CartItem } from '../model/cart-item.model';
import { Product } from '../../products/model/product.model';

const CART_STORAGE_KEY = 'shopping-cart-cart';

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore
  }
}

function lineTtc(item: CartItem): number {
  return getPriceTtc(item.product) * item.quantity;
}

function lineTax(item: CartItem): number {
  return (getPriceTtc(item.product) - item.product.price) * item.quantity;
}

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState({ cartItems: loadCartFromStorage() }),
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
      saveCartToStorage(next);
    },
    removeItem(productId: number): void {
      const next = store.cartItems().filter((i) => i.product.id !== productId);
      patchState(store, { cartItems: next });
      saveCartToStorage(next);
    },
  }))
);
