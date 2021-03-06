import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import * as StackTraceParser from 'error-stack-parser';

import { ErrorsService } from './errors.service';
import { NotificationService } from '../core/services/notification/notification.service';

@Injectable()
export class ErrorsHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {
    // Because the ErrorHandler is created before the providers, we’ll have to use the Injector to get them.
    const notificationService = this.injector.get(NotificationService);
    const errorsService = this.injector.get(ErrorsService);
    const router = this.injector.get(Router);

    if (error instanceof HttpErrorResponse) {
      // Server error happened
      if (!navigator.onLine) {
        // No Internet connection
        return notificationService.notify('No Internet Connection');
      }
      // Http Error
      // Send the error to the server
      errorsService.log(error).subscribe();
      // Show notification to the user
      return notificationService.notify(`${error.status} - ${error.message}`);
    } else {
      // Client Error Happend
      // Send the error to the server and then
      // redirect the user to the page with all the info

      //  when using api for error
      errorsService.log(error).subscribe(errorWithContextInfo => {
        console.log(errorWithContextInfo);
        router.navigate(['/', 'error'], {
          queryParams: errorWithContextInfo,
        });
      });

      // when not using api
      // router.navigate(['/error'], { queryParams: { error } });
    }

    // Log the error anyway
    console.error(error);
  }
}
