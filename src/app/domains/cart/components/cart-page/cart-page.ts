import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Subheader } from '@shared/components/subheader/subheader';
import { getPriceTtc } from '@shared/utils/tax.utils';
import { CartStore } from '@core/store/cart.store';
import { CartItemPricing } from '@shared/models/cart-item.model';

@Component({
  selector: 'app-cart-page',
  imports: [Subheader, CurrencyPipe],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {
  protected cartStore = inject(CartStore);

  protected cartItemsPricing = computed<CartItemPricing[]>(() =>
    this.cartStore.cartItems().map((item): CartItemPricing => {
      const unitTtc = getPriceTtc(item.product);
      const unitHt = item.product.price;
      const qty = item.quantity;
      const unitPriceHt = unitHt * qty;
      const unitPriceTtc = unitTtc * qty;
      const unitTax = (unitTtc - unitHt) * qty;

      return {
        ...item,
        unitPriceHt,
        unitPriceTtc,
        unitTax,
      };
    })
  );
}
