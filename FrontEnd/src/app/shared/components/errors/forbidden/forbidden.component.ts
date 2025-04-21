import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <mat-icon class="error-icon">lock</mat-icon>
        <h1>403 - Access Forbidden</h1>
        <p>Sorry, you don't have permission to access this page.</p>
        <button mat-raised-button color="primary" routerLink="/dashboard">
          Back to Dashboard
        </button>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }

    .error-content {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 500px;
    }

    .error-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #f44336;
      margin-bottom: 1rem;
    }

    h1 {
      margin-bottom: 1rem;
      color: #333;
    }

    p {
      margin-bottom: 2rem;
      color: #666;
    }
  `]
})
export class ForbiddenComponent { }
