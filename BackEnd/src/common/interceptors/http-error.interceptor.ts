import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface ErrorResponse {
  status?: number;
  message?: string;
}

@Injectable()
export class HttpErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          return throwError(() => err);
        }

        const error = err as ErrorResponse;
        const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || 'Internal server error';

        const request = context.switchToHttp().getRequest<Request>();
        const url = request.url || 'unknown';
        return throwError(
          () =>
            new HttpException(
              {
                statusCode: status,
                message: message,
                timestamp: new Date().toISOString(),
                path: url,
              },
              status,
            ),
        );
      }),
    );
  }
}
