import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpBaseService {
  protected apiUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected async get<T>(url: string): Promise<T> {
    try {
      return await lastValueFrom(
        this.http.get<T>(`${this.apiUrl}/${url}`).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      throw this.processError(error);
    }
  }

  protected async post<T>(url: string, data: any): Promise<T> {
    try {
      return await lastValueFrom(
        this.http.post<T>(`${this.apiUrl}/${url}`, data).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      throw this.processError(error);
    }
  }

  protected async put<T>(url: string, data: any): Promise<T> {
    try {
      return await lastValueFrom(
        this.http.put<T>(`${this.apiUrl}/${url}`, data).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      throw this.processError(error);
    }
  }

  protected async patch<T>(url: string, data: any): Promise<T> {
    try {
      return await lastValueFrom(
        this.http.patch<T>(`${this.apiUrl}/${url}`, data).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      throw this.processError(error);
    }
  }

  protected async delete<T>(url: string): Promise<T> {
    try {
      return await lastValueFrom(
        this.http.delete<T>(`${this.apiUrl}/${url}`).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      throw this.processError(error);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  private processError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('An unknown error occurred');
  }
}
