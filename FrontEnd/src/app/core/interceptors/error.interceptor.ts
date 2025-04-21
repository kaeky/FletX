import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 401) {
          // Unauthorized - Token might be expired
          authService.logout();
          router.navigate(['/auth/login'], {
            queryParams: { returnUrl: router.url }
          });
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (error.status === 403) {
          // Forbidden - Not enough permissions
          router.navigate(['/403']);
          errorMessage = 'You do not have permission to access this resource.';
        } else if (error.status === 404) {
          // Not found
          router.navigate(['/404']);
          errorMessage = 'Resource not found.';
        } else {
          // Other errors
          errorMessage = error.error?.message || error.statusText || errorMessage;
        }
      }

      // You can add a notification service to show error messages
      console.error(errorMessage);

      return throwError(() => new Error(errorMessage));
    })
  );
};
