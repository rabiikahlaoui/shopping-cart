import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../model/product.model';
import { ProductsService } from '../../services/products.service';
import { take } from 'rxjs';
import { Subheader } from '../../../../shared/components/subheader/subheader';
import { Spinner } from '../../../../shared/components/spinner/spinner';
import { ProductCard } from '../product-card/product-card';
import { ProductsFilter } from '../products-filter/products-filter';

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
export class ProductsPage implements OnInit {
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

  private productsService = inject(ProductsService);

  ngOnInit(): void {
    this.productsService.getProducts()
      .pipe(take(1))
      .subscribe((products) => {
        this.products.set(products);
        this.loading.set(false);
      });
  }

  setCategory(value: string): void {
    this.selectedCategory.set(value);
  }
}
