import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpResponse, HttpHandlerFn } from '@angular/common/http';
import { of } from 'rxjs';

import { mockApiInterceptor } from './mock-api.interceptor';

describe('mockApiInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => mockApiInterceptor(req, next));

  const next: HttpHandlerFn = () => of(new HttpResponse({ status: 200 }));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should return mock products for GET request with url containing /api/products', (done) => {
    const req = new HttpRequest('GET', 'https://api.example.com/api/products');
    interceptor(req, next).subscribe((event) => {
      if (event instanceof HttpResponse) {
        expect(event.status).toBe(200);
        expect(Array.isArray(event.body)).toBe(true);
        expect((event.body as unknown[]).length).toBeGreaterThan(0);
        done();
      }
    });
  });

  it('should pass to next handler for non GET request', (done) => {
    const req = new HttpRequest('POST', 'https://api.example.com/api/products');
    interceptor(req, next).subscribe((event) => {
      if (event instanceof HttpResponse) {
        expect(event.status).toBe(200);
        done();
      }
    });
  });

  it('should pass to next handler for GET request without /api/products in url', (done) => {
    const req = new HttpRequest('GET', 'https://api.example.com/api/other');
    interceptor(req, next).subscribe((event) => {
      if (event instanceof HttpResponse) {
        expect(event.status).toBe(200);
        done();
      }
    });
  });
});
