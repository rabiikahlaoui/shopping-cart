import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFilter } from './products-filter';

describe('ProductsFilter', () => {
  let component: ProductsFilter;
  let fixture: ComponentFixture<ProductsFilter>;

  const categories = ['Food', 'Books', 'Electric'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsFilter);
    fixture.componentRef.setInput('categories', categories);
    fixture.componentRef.setInput('selectedCategory', '');
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label and select with all categories option', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('label')?.textContent?.trim()).toBe('Catégorie');

    const select = compiled.querySelector('select');
    expect(select).toBeTruthy();

    const options = compiled.querySelectorAll('option');
    expect(options.length).toBe(categories.length + 1);
    expect(options[0].getAttribute('value')).toBe('');
    expect(options[0].textContent?.trim()).toBe('Toutes');
  });

  it('should display all categories as options', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const options = compiled.querySelectorAll('option');

    categories.forEach((category, index) => {
      expect(options[index + 1].getAttribute('value')).toBe(category);
      expect(options[index + 1].textContent?.trim()).toBe(category);
    });
  });

  it('should set select value from selectedCategory input', () => {
    fixture.componentRef.setInput('selectedCategory', 'Food');
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('Food');
  });

  it('should emit category when selection changes', () => {
    const emitted: string[] = [];
    component.categoryChange.subscribe((value) => emitted.push(value));

    const event = new Event('change');
    Object.defineProperty(event, 'target', {
      value: { value: 'Books' },
      writable: false,
    });

    component.setCategory(event);

    expect(emitted).toEqual(['Books']);
  });
});
