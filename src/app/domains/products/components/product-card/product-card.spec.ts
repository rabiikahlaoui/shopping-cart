import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCard } from './product-card';
import { Product } from '../../model/product.model';

const mockProduct: Product = {
  id: 1,
  productName: 'Test Product',
  price: 10,
  quantity: 5,
  isImported: false,
  category: 'food',
};

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', mockProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product name', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent?.trim()).toContain('Test Product');
  });

  it('should display add-to-cart section when quantity > 0', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Quantité');
    expect(el.textContent).toContain('Ajouter');
  });

  it('should display Non disponible when quantity is 0', () => {
    fixture.componentRef.setInput('product', { ...mockProduct, quantity: 0 });
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Non disponible');
  });

  it('should have out-of-stock class when quantity <= 0', () => {
    fixture.componentRef.setInput('product', { ...mockProduct, quantity: 0 });
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.product-item.out-of-stock')).toBeTruthy();
  });

  it('should not have out-of-stock class when quantity > 0', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.product-item.out-of-stock')).toBeFalsy();
  });
});
