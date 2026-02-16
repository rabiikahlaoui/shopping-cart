import { PriceTtcPipe } from './price-ttc.pipe';
import { Product } from '../model/product.model';

describe('PriceTtcPipe', () => {
  const pipe = new PriceTtcPipe();

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return price unchanged for food not imported', () => {
    const product: Product = {
      id: 1,
      productName: 'Bread',
      price: 10,
      quantity: 1,
      isImported: false,
      category: 'Food',
    };
    expect(pipe.transform(product)).toBe(10);
  });

  it('should add 10% tax for books', () => {
    const product: Product = {
      id: 1,
      productName: 'Book',
      price: 10,
      quantity: 1,
      isImported: false,
      category: 'Books',
    };
    expect(pipe.transform(product)).toBe(11);
  });

  it('should add 20% tax for other category', () => {
    const product: Product = {
      id: 1,
      productName: 'Lamp',
      price: 10,
      quantity: 1,
      isImported: false,
      category: 'Electric',
    };
    expect(pipe.transform(product)).toBe(12);
  });

  it('should add import tax when isImported is true', () => {
    const product: Product = {
      id: 1,
      productName: 'Wine',
      price: 10,
      quantity: 1,
      isImported: true,
      category: 'Food',
    };
    expect(pipe.transform(product)).toBe(10.5);
  });
});
