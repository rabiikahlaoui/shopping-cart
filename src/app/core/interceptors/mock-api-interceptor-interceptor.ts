import { HttpInterceptorFn } from '@angular/common/http';

export const mockApiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
