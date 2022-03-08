import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertMessageService {
  durationInSeconds = 5000;
  constructor(private snackBar: MatSnackBar) { }

  SnackBarMsg(msg: string) {
    this.snackBar.open(msg);
  }

  SnackBarWithActions(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: this.durationInSeconds,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }
}
