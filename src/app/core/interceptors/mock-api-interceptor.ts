import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import productsData from '../../../data/products.json';
import { of } from 'rxjs';

const PRODUCTS_API_PATH = '/api/products';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const isProductsListGet = req.method === 'GET' && req.url.includes(PRODUCTS_API_PATH);

  if (isProductsListGet) {
    return of(
      new HttpResponse({
        status: 200,
        body: [...(productsData as unknown[])]
      })
    );
  }

  return next(req);
};
