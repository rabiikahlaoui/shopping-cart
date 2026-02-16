import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-products-filter',
  imports: [],
  templateUrl: './products-filter.html',
  styleUrl: './products-filter.scss',
})
export class ProductsFilter {
  categories = input.required<string[]>();
  selectedCategory = input.required<string>();
  categoryChange = output<string>();

  setCategory(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryChange.emit(value);
  }
}
