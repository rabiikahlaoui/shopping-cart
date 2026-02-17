import { TaxProduct } from './tax-product.model';

export interface Product extends TaxProduct {
  id: number;
  productName: string;
  quantity: number;
}
