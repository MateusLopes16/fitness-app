import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getStoredToken();

  console.log('JWT Interceptor - Request URL:', req.url);
  console.log('JWT Interceptor - Token exists:', !!token);
  console.log('JWT Interceptor - Token preview:', token ? token.substring(0, 20) + '...' : 'No token');

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('JWT Interceptor - Authorization header added');
    return next(authReq);
  }

  console.log('JWT Interceptor - No token found, request sent without Authorization header');
  return next(req);
};
