import {
  getPriceTtc,
  roundUpToFiveCents,
  getBaseTaxRatePercent,
} from './tax.utils';
import { Product } from '../model/product.model';

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    productName: 'Test',
    price: 10,
    quantity: 1,
    isImported: false,
    category: 'Food',
    ...overrides,
  };
}

describe('roundUpToFiveCents', () => {
  it('should round 0.99 to 1.00', () => {
    const inputAmount = 0.99;
    const result = roundUpToFiveCents(inputAmount);
    const expected = 1.0;
    expect(result).toBe(expected);
  });

  it('should keep 1.00 as 1.00', () => {
    const inputAmount = 1.0;
    const result = roundUpToFiveCents(inputAmount);
    const expected = 1.0;
    expect(result).toBe(expected);
  });

  it('should round 1.01 to 1.05', () => {
    const inputAmount = 1.01;
    const result = roundUpToFiveCents(inputAmount);
    const expected = 1.05;
    expect(result).toBe(expected);
  });

  it('should round 1.02 to 1.05', () => {
    const inputAmount = 1.02;
    const result = roundUpToFiveCents(inputAmount);
    const expected = 1.05;
    expect(result).toBe(expected);
  });
});

describe('getBaseTaxRatePercent', () => {
  it('should return 0 for food', () => {
    const category = 'Food';
    const result = getBaseTaxRatePercent(category);
    const expected = 0;
    expect(result).toBe(expected);
  });

  it('should return 0 for medecine', () => {
    const category = 'Medecine';
    const result = getBaseTaxRatePercent(category);
    const expected = 0;
    expect(result).toBe(expected);
  });

  it('should return 0 for lowercase food', () => {
    const category = 'food';
    const result = getBaseTaxRatePercent(category);
    const expected = 0;
    expect(result).toBe(expected);
  });

  it('should return 10 for books', () => {
    const category = 'Books';
    const result = getBaseTaxRatePercent(category);
    const expected = 10;
    expect(result).toBe(expected);
  });

  it('should return 20 for other categories', () => {
    const category = 'Electric';
    const result = getBaseTaxRatePercent(category);
    const expected = 20;
    expect(result).toBe(expected);
  });

  it('should trim and normalize category', () => {
    const category = '  books  ';
    const result = getBaseTaxRatePercent(category);
    const expected = 10;
    expect(result).toBe(expected);
  });
});

describe('getPriceTtc', () => {
  describe('essential products (food, medecine) - 0% base tax', () => {
    it('should not change price when food and not imported', () => {
      const inputProduct = product({ category: 'Food', price: 10 });
      const priceTtc = getPriceTtc(inputProduct);
      expect(priceTtc).toBe(10);
    });

    it('should not change price when medecine and not imported', () => {
      const inputProduct = product({ category: 'Medecine', price: 5 });
      const priceTtc = getPriceTtc(inputProduct);
      expect(priceTtc).toBe(5);
    });

    it('should add 5% import tax and round to 5 cents when food and imported', () => {
      const inputProduct = product({ category: 'Food', price: 10, isImported: true });
      const priceTtc = getPriceTtc(inputProduct);
      const expected = 10.5;
      expect(priceTtc).toBe(expected);
    });

    it('should round import tax up to 5 cents when food and imported', () => {
      const inputProduct = product({ category: 'Food', price: 1.01, isImported: true });
      const priceTtc = getPriceTtc(inputProduct);
      const expected = 1.11;
      expect(priceTtc).toBe(expected);
    });
  });

  describe('books - 10% base tax', () => {
    it('should add 10% tax and round to 5 cents when books and not imported', () => {
      const inputProduct = product({ category: 'Books', price: 10 });
      const priceTtc = getPriceTtc(inputProduct);
      const expected = 11;
      expect(priceTtc).toBe(expected);
    });

    it('should round base tax to 5 cents', () => {
      const inputProduct = product({ category: 'Books', price: 1.01 });
      const priceTtc = getPriceTtc(inputProduct);
      const expected = 1.16;
      expect(priceTtc).toBe(expected);
    });

    it('should add 10% + 5% import and round to 5 cents when books and imported', () => {
      const inputProduct = product({ category: 'Books', price: 10, isImported: true });
      const priceTtc = getPriceTtc(inputProduct);
      const expected = 11.5;
      expect(priceTtc).toBe(expected);
    });
  });

  describe('other products - 20% base tax', () => {
    it('should add 20% tax and round to 5 cents when other category and not imported', () => {
      const inputProduct = product({ category: 'Electric', price: 10 });
      const priceTtc = getPriceTtc(inputProduct);
      const expected = 12;
      expect(priceTtc).toBe(expected);
    });

    it('should add 20% + 5% import and round to 5 cents when other and imported', () => {
      const inputProduct = product({ category: 'Parfum', price: 10, isImported: true });
      const priceTtc = getPriceTtc(inputProduct);
      const expected = 12.5;
      expect(priceTtc).toBe(expected);
    });

    it('should round taxes to 5 cents', () => {
      const inputProduct = product({ category: 'Electric', price: 1, isImported: true });
      const priceTtc = getPriceTtc(inputProduct);
      const expected = 1.25;
      expect(priceTtc).toBe(expected);
    });
  });

  describe('rounding to 5 cents', () => {
    it('should round 0.99 tax to 1.00', () => {
      const inputProduct = product({ category: 'Food', price: 19.8, isImported: true });
      const priceTtc = getPriceTtc(inputProduct);
      const expected = 19.8 + 1;
      expect(priceTtc).toBe(expected);
    });

    it('should round 1.01 tax to 1.05', () => {
      const inputProduct = product({ category: 'Books', price: 10.1 });
      const priceTtc = getPriceTtc(inputProduct);
      const expected = 10.1 + 1.05;
      expect(priceTtc).toBe(expected);
    });
  });
});
