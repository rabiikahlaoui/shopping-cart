import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '@core/api/base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends BaseApiService {
  protected override readonly apiPath = '/api/products';
  private readonly http: HttpClient = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
