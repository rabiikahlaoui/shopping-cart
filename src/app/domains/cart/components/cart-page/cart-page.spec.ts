import { ComponentFixture, TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { CartPage } from './cart-page';
import { CartStore } from '@core/store/cart.store';
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

describe('CartPage', () => {
  let fixture: ComponentFixture<CartPage>;
  let store: InstanceType<typeof CartStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [CartStore],
    }).compileComponents();

    store = TestBed.inject(CartStore);
    patchState(store, { cartItems: [] });

    fixture = TestBed.createComponent(CartPage);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show empty state when cart is empty', () => {
    const emptyState = fixture.nativeElement.querySelector('app-empty-state');
    expect(emptyState).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Panier vide');
  });

  it('should show cart table when cart has items', () => {
    patchState(store, {
      cartItems: [{ product: product({ id: 1, productName: 'Apple' }), quantity: 2 }],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.table')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Apple');
    expect(fixture.nativeElement.textContent).toContain('2');
  });

  it('should remove item when remove button is clicked', () => {
    patchState(store, {
      cartItems: [{ product: product({ id: 1 }), quantity: 1 }],
    });
    fixture.detectChanges();

    const removeButton = fixture.nativeElement.querySelector('.btn-delete');
    expect(removeButton).toBeTruthy();
    removeButton.click();
    fixture.detectChanges();

    expect(store.cartItems()).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('Panier vide');
  });
});
