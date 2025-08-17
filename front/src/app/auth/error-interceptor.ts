import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Error Interceptor - 401 Unauthorized detected');
        console.log('Error details:', error);
        
        // Clear invalid tokens and redirect to login
        authService.logout();
        router.navigate(['/auth']);
      }
      
      return throwError(() => error);
    })
  );
};
