import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/api/base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends BaseApiService {
  protected override readonly apiPath = '/api/products';

  constructor(private readonly http: HttpClient) {
    super();
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
