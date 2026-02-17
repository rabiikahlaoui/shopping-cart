import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subheader } from '@shared/components/subheader/subheader';
import { Spinner } from '@shared/components/spinner/spinner';
import { Product } from '@shared/models/product.model';
import { ProductsService } from '@domains/products/services/products.service';
import { ProductCard } from '@domains/products/components/product-card/product-card';
import { ProductsFilter } from '@domains/products/components/products-filter/products-filter';

@Component({
  selector: 'app-products-page',
  imports: [
    Subheader,
    Spinner,
    ProductCard,
    ProductsFilter,
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {
  private productsService = inject(ProductsService);
  products = signal<Product[]>([]);
  loading = signal(true);
  selectedCategory = signal<string>('');

  categories = computed(() => {
    const list = this.products();
    const set = new Set(list.map((p) => p.category));
    return [...set].sort();
  });

  filteredProducts = computed(() => {
    const list = this.products();
    const category = this.selectedCategory();
    const filtered = category ? list.filter((p) => p.category === category) : list;
    return [...filtered].sort((a, b) => (a.quantity > 0 ? 0 : 1) - (b.quantity > 0 ? 0 : 1));
  });

  constructor() {
    this.productsService.getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe((products) => {
        this.products.set(products);
        this.loading.set(false);
      });
  }

  setCategory(value: string): void {
    this.selectedCategory.set(value);
  }
}
