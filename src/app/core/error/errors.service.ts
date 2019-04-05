import { ErrorHandler, Injectable } from '@angular/core';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

// Cool library to deal with errors: https://www.stacktracejs.com
import * as StackTraceParser from 'error-stack-parser';
import { Router, NavigationError, Event } from '@angular/router';

@Injectable()
export class ErrorsService {
  constructor(private location: LocationStrategy, private router: Router) {
    // Listen to the navigation errors
    this.router.events.subscribe((event: Event) => {
      // Redirect to the ErrorComponent
      if (event instanceof NavigationError) {
        if (!navigator.onLine) {
          return;
        }
        // Redirect to the ErrorComponent (after observable api)
        // this.log(event.error).subscribe(errorWithContext => {
        //   this.router.navigate(['/error'], {
        //     queryParams: errorWithContext,
        //   });
        // });
      }
    });
  }

  log(error) {
    // Log the error to the console
    console.error(error);
    // Send error to server
    const errorToSend = this.addContextInfo(error);
    // return fakeHttpService.post(errorToSend);
  }

  addContextInfo(error) {
    // All the context details that you want (usually coming from other services; Constants, UserService...)
    const name = error.name || null;
    const appId = 'shthppnsApp';
    const user = 'ShthppnsUser';
    const time = new Date().getTime();
    const id = `${appId}-${user}-${time}`;
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
      id,
      url,
      status,
      message,
      stack,
    };

    return errorToSend;
  }
}
