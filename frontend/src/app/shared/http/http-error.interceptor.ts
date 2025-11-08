import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let message = 'Something went wrong';
        if (typeof navigator !== 'undefined' && !navigator.onLine) message = 'You are offline';
        else if (err.status === 0) message = 'Network error';
        else if (err.status >= 500) message = 'Server error';
        else if (err.status >= 400)
          message = (err.error && (err.error.detail || err.error.message)) || 'Request error';
        (err as any).friendlyMessage = message;
        return throwError(() => err);
      }),
    );
  }
}
