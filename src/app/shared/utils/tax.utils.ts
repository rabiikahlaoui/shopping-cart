import { TaxProduct } from '../models/tax-product.model';

const ESSENTIAL_CATEGORIES = ['food', 'medecine'];
const BOOKS_CATEGORY = 'books';

export function roundUpToFiveCents(amount: number): number {
  return Math.ceil(amount * 20) / 20;
}

export function getBaseTaxRatePercent(category: string): number {
  const normalized = category.toLowerCase().trim();
  if (ESSENTIAL_CATEGORIES.includes(normalized)) return 0;
  if (normalized === BOOKS_CATEGORY) return 10;
  return 20;
}

export function getPriceTtc(product: TaxProduct): number {
  const pht = product.price;
  const baseTax = getBaseTaxRatePercent(product.category);
  const importTax = product.isImported ? 5 : 0;

  const taxBase = roundUpToFiveCents((pht * baseTax) / 100);
  const taxImport = roundUpToFiveCents((pht * importTax) / 100);

  return pht + taxBase + taxImport;
}
