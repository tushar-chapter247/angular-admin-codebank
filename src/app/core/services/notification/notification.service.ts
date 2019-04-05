import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackbar: MatSnackBar) {}

  // NOTIFY USER BY SHOWING MESSAGE IN SNACKBAR
  async notify(message) {
    this.snackbar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
