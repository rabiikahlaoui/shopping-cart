import { Component, computed, inject, input, signal } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Product } from '@shared/models/product.model';
import { getPriceTtc } from '@shared/utils/tax.utils';
import { CartStore } from '@core/store/cart.store';

const CATEGORY_ICONS: Record<string, string> = {
  Food: 'bi bi-basket',
  Medecine: 'bi bi-capsule',
  Books: 'bi bi-book',
  Electric: 'bi bi-plug',
  Parfum: 'bi bi-droplet',
};
const DEFAULT_CATEGORY_ICON = 'bi bi-cart';

@Component({
  selector: 'app-product-card',
  imports: [
    CurrencyPipe,
    TitleCasePipe,
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();
  private cartStore = inject(CartStore);

  quantityToAdd = signal(1);

  categoryIconClass = computed(() => {
    const category = this.product()?.category;
    return (category && CATEGORY_ICONS[category]) || DEFAULT_CATEGORY_ICON;
  });

  priceTtc = computed(() => getPriceTtc(this.product()));

  availableQuantity = computed(() => {
    const quantityInCart = this.cartStore.getQuantityInCart(this.product().id);
    return this.product().quantity - quantityInCart;
  });

  effectiveQuantityToAdd = computed(() =>
    Math.min(this.quantityToAdd(), this.availableQuantity())
  );

  get quantityOptions(): number[] {
    const max = this.availableQuantity();
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  setQuantity(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.quantityToAdd.set(Number(value));
  }

  addToCart(): void {
    const product = this.product();
    const toAdd = this.effectiveQuantityToAdd();

    this.cartStore.addItem(product, toAdd);
  }
}
