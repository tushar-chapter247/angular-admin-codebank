import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../services/notification/notification.service';

@Injectable()
export class ErrorsHandler implements ErrorHandler {
  constructor(
    // Because the ErrorHandler is created before the providers, we’ll have to use the Injector to get them.
    private injector: Injector
  ) {}

  async handleError(error: Error | HttpErrorResponse): Promise<any> {
    const notificationService = this.injector.get(NotificationService);

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        return await notificationService.notify('No Internet Connection');
      } else {
        // Handle Http Error (error.status === 403, 404...)
        return await notificationService.notify(
          `${error.status} - ${error.message}`
        );
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
    }

    // Log the error anyway
    console.error('It happens: ', error);
  }
}
