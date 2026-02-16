import { Pipe, PipeTransform } from '@angular/core';
import { getPriceTtc } from '@shared/utils/tax.utils';
import { Product } from '../model/product.model';

@Pipe({
  name: 'priceTtc',
  standalone: true,
})
export class PriceTtcPipe implements PipeTransform {
  transform(product: Product): number {
    return getPriceTtc(product);
  }
}
