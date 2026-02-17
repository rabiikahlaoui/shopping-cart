import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CartItemPricing = CartItem & {
  unitPriceHt: number;
  unitPriceTtc: number;
  unitTax: number;
};
