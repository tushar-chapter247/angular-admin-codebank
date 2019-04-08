import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification/notification.service';

@Injectable({ providedIn: 'root' })
export class ServerErrorsInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(5), // retry for five times before sending error response
      catchError((error: HttpErrorResponse) => {
        // Because the ServerErrorsInterceptor is created before the providers, we’ll have to use the Injector to get them.
        const notificationService = this.injector.get(NotificationService);

        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.status) {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${
            error.message
          }`;
        } else {
          errorMessage = `Message: ${error.message}`;
        }

        notificationService.notify(errorMessage);
        // if want to save errors, save 'error' object;

        return throwError(errorMessage);
      })
    );
  }
}
