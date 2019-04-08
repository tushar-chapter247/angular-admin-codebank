import { ErrorHandler, Injectable } from '@angular/core';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// Cool library to deal with errors: https://www.stacktracejs.com
import * as StackTraceParser from 'error-stack-parser';
import { Router, NavigationError, Event } from '@angular/router';
import { CommonService } from '../services/common/common.service';

@Injectable()
export class ErrorsService {
  constructor(
    private http: HttpClient,
    private location: LocationStrategy,
    private router: Router,
    private commonService: CommonService
  ) {
    // Listen to the navigation errors
    this.router.events.subscribe((event: Event) => {
      // Redirect to the ErrorComponent
      if (event instanceof NavigationError) {
        if (!navigator.onLine) {
          return;
        }
        // Redirect to the ErrorComponent (after observable api)
        this.log(event.error).subscribe(errorWithContext => {
          this.router.navigate(['/error'], {
            queryParams: errorWithContext,
          });
        });
      }
    });
  }

  log(error) {
    // Log the error to the console
    console.error(error);
    // Send error to server
    const errorToSend = this.addContextInfo(error);
    // use json server to save json file locally
    return this.commonService.post('Errors', errorToSend);
  }

  addContextInfo(error) {
    // All the context details that you want (usually coming from other services; Constants, UserService...)
    const name = error.name || null;
    const appId = 'admin-angular';
    const user = 'Administrator';
    const time = new Date().getTime();
    const errorId = `${appId}-${user}-${time}`;
    const url =
      this.location instanceof PathLocationStrategy ? this.location.path() : '';
    const status = error.status || null;
    const message = error.message || error.toString();
    const stack =
      error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);
    const errorToSend = {
      name,
      appId,
      user,
      time,
      errorId,
      url,
      status,
      message,
      stack,
    };

    return errorToSend;
  }
}
