import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { NgClass, NgIf } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AlertData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  imports: [
    MatIconModule,
    NgClass,
    MatIconButton,
    NgIf,
  ],
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: AlertData,
    private snackBarRef: MatSnackBarRef<AlertComponent>
  ) {}

  ngOnInit(): void {
    if (this.data.duration) {
      setTimeout(() => {
        this.snackBarRef.dismiss();
      }, this.data.duration);
    }
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
