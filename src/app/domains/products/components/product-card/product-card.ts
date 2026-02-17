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
  quantityToAdd = signal(1);
  private cartStore = inject(CartStore);

  readonly categoryIconClass = computed(() => {
    const category = this.product()?.category;
    return (category && CATEGORY_ICONS[category]) || DEFAULT_CATEGORY_ICON;
  });

  priceTtc = computed(() => getPriceTtc(this.product()));

  availableQuantity = computed(() => {
    const product = this.product();
    if (!product) return 0;
    return Math.max(0, product.quantity - this.cartStore.getQuantityInCart(product.id));
  });

  effectiveQuantityToAdd = computed(() =>
    Math.min(this.quantityToAdd(), Math.max(1, this.availableQuantity()))
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
    const max = this.availableQuantity();
    if (!product || toAdd <= 0 || max <= 0) return;
    this.cartStore.addItem(product, Math.min(toAdd, max));
  }
}
