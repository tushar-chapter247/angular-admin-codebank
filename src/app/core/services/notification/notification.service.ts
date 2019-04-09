import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackbar: MatSnackBar) {}

  // NOTIFY USER BY SHOWING MESSAGE IN SNACKBAR
  async notify(message: string, buttonText?: string): Promise<any> {
    this.snackbar.open(message, buttonText ? buttonText : null, {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
