import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { CartStore } from './cart.store';
import { Product } from '@shared/models/product.model';

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    productName: 'Test Product',
    price: 10,
    quantity: 100,
    isImported: false,
    category: 'Food',
    ...overrides,
  };
}

describe('CartStore', () => {
  let store: InstanceType<typeof CartStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartStore],
    });
    store = TestBed.inject(CartStore);
    patchState(store, { cartItems: [] });
  });

  it('should start with empty cart', () => {
    expect(store.cartItems()).toEqual([]);
    expect(store.cartItemsCount()).toBe(0);
    expect(store.cartTotal()).toBe(0);
    expect(store.cartTotalTaxes()).toBe(0);
  });

  it('getQuantityInCart should return 0 when product not in cart', () => {
    expect(store.getQuantityInCart(99)).toBe(0);
  });

  describe('addItem', () => {
    it('should add new product to cart', () => {
      const p = product({ id: 1 });
      store.addItem(p, 2);

      expect(store.cartItems()).toHaveLength(1);
      expect(store.cartItems()[0]).toEqual({ product: p, quantity: 2 });
      expect(store.cartItemsCount()).toBe(2);
      expect(store.getQuantityInCart(1)).toBe(2);
    });

    it('should increase quantity when product already in cart', () => {
      const p = product({ id: 1 });
      store.addItem(p, 2);
      store.addItem(p, 3);

      expect(store.cartItems()).toHaveLength(1);
      expect(store.cartItems()[0].quantity).toBe(5);
      expect(store.cartItemsCount()).toBe(5);
    });

    it('should keep separate entries for different products', () => {
      const p1 = product({ id: 1 });
      const p2 = product({ id: 2 });
      store.addItem(p1, 1);
      store.addItem(p2, 2);

      expect(store.cartItems()).toHaveLength(2);
      expect(store.cartItemsCount()).toBe(3);
      expect(store.getQuantityInCart(1)).toBe(1);
      expect(store.getQuantityInCart(2)).toBe(2);
    });
  });

  describe('removeItem', () => {
    it('should remove product from cart', () => {
      const p = product({ id: 1 });
      store.addItem(p, 2);
      store.removeItem(1);

      expect(store.cartItems()).toHaveLength(0);
      expect(store.cartItemsCount()).toBe(0);
      expect(store.getQuantityInCart(1)).toBe(0);
    });

    it('should not affect other products', () => {
      const p1 = product({ id: 1 });
      const p2 = product({ id: 2 });
      store.addItem(p1, 1);
      store.addItem(p2, 2);
      store.removeItem(1);

      expect(store.cartItems()).toHaveLength(1);
      expect(store.cartItems()[0].product.id).toBe(2);
      expect(store.cartItemsCount()).toBe(2);
    });
  });

  describe('cartTotal and cartTotalTaxes', () => {
    it('should compute total TTC and taxes for food (0% base tax)', () => {
      const p = product({ id: 1, price: 10, category: 'Food', isImported: false });
      store.addItem(p, 2);

      expect(store.cartTotal()).toBe(20);
      expect(store.cartTotalTaxes()).toBe(0);
    });

    it('should include tax in total for non-essential category', () => {
      const p = product({ id: 1, price: 10, category: 'Other', isImported: false });
      store.addItem(p, 1);

      expect(store.cartTotal()).toBe(12);
      expect(store.cartTotalTaxes()).toBe(2);
    });
  });
});
