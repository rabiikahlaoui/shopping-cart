import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../model/product.model';
import { getPriceTtc } from '../../../shared/utils/tax.utils';

@Pipe({
  name: 'priceTtc',
  standalone: true,
})
export class PriceTtcPipe implements PipeTransform {
  transform(product: Product): number {
    return getPriceTtc(product);
  }
}
