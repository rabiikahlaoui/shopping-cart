import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductsPage } from './products-page';
import { ProductsService } from '@domains/products/services/products.service';
import { Product } from '@shared/models/product.model';

const mockProducts: Product[] = [
  { id: 1, productName: 'A', price: 10, quantity: 0, isImported: false, category: 'Food' },
  { id: 2, productName: 'B', price: 20, quantity: 5, isImported: false, category: 'Food' },
  { id: 3, productName: 'C', price: 30, quantity: 1, isImported: false, category: 'Books' },
];

describe('ProductsPage', () => {
  let component: ProductsPage;
  let fixture: ComponentFixture<ProductsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsPage],
      providers: [
        {
          provide: ProductsService,
          useValue: { getProducts: () => of(mockProducts) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(component.products().length).toBe(3);
    expect(component.products()).toEqual(mockProducts);
  });

  it('should expose unique sorted categories from products', () => {
    expect(component.categories()).toEqual(['Books', 'Food']);
  });

  it('should filter products by selected category', () => {
    component.setCategory('Food');
    fixture.detectChanges();
    const filtered = component.filteredProducts();
    expect(filtered.length).toBe(2);
    expect(filtered.every((p) => p.category === 'Food')).toBe(true);
  });

  it('should show all products when no category selected', () => {
    component.setCategory('');
    fixture.detectChanges();
    expect(component.filteredProducts().length).toBe(3);
  });

  it('should put out of stock products at end of list', () => {
    component.setCategory('');
    fixture.detectChanges();
    const list = component.filteredProducts();
    const inStockIndices = list.map((p, i) => (p.quantity > 0 ? i : -1)).filter((i) => i >= 0);
    const outOfStockIndices = list.map((p, i) => (p.quantity <= 0 ? i : -1)).filter((i) => i >= 0);
    if (outOfStockIndices.length && inStockIndices.length) {
      expect(Math.min(...outOfStockIndices)).toBeGreaterThan(Math.max(...inStockIndices));
    }
    expect(list[list.length - 1].quantity).toBe(0);
  });

  it('should update selectedCategory when setCategory is called', () => {
    expect(component.selectedCategory()).toBe('');
    component.setCategory('Books');
    expect(component.selectedCategory()).toBe('Books');
  });
});
