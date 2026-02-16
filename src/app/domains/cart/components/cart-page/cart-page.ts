import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Subheader } from '../../../../shared/components/subheader/subheader';
import { CartStore } from '../../store/cart.store';
import { CartItemWithTotals } from '../../model/cart-item.model';
import { getPriceTtc } from '../../../../shared/utils/tax.utils';

@Component({
  selector: 'app-cart-page',
  imports: [Subheader, CurrencyPipe],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {
  protected cartStore = inject(CartStore);

  protected cartItemsWithTotals = computed<CartItemWithTotals[]>(() =>
    this.cartStore.cartItems().map((item): CartItemWithTotals => {
      const unitPriceTtc = getPriceTtc(item.product);
      const unitPriceHt = item.product.price;
      const unitTax = unitPriceTtc - unitPriceHt;

      return {
        ...item,
        unitPriceHt,
        unitPriceTtc,
        unitTax,
      };
    })
  );
}
