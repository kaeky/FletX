import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 401) {
            // Unauthorized - Token might be expired
            this.authService.logout();
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: this.router.url }
            });
            errorMessage = 'Your session has expired. Please log in again.';
          } else if (error.status === 403) {
            // Forbidden - Not enough permissions
            this.router.navigate(['/403']);
            errorMessage = 'You do not have permission to access this resource.';
          } else if (error.status === 404) {
            // Not found
            this.router.navigate(['/404']);
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
  }
}
