import { Product } from '../../products/model/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CartItemWithTotals = CartItem & {
  unitPriceHt: number;
  unitPriceTtc: number;
  unitTax: number;
};
