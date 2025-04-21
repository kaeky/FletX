import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatLabel,
    MatFormField,
    MatProgressSpinnerModule,
    NgIf,
    MatButton,
    ReactiveFormsModule,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatCardActions,
    MatAnchor,
    RouterLink,
    MatInput,
    MatIconButton,
  ],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    // Initialize form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  // Getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  async onSubmit(): Promise<void> {
    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      const credentials = {
        email: this.f['email'].value,
        password: this.f['password'].value
      };

      await this.authService.login(credentials);

      // Navigate to return url
      this.router.navigate([this.returnUrl]);
    } catch (error) {
      let errorMessage = 'Invalid email or password';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.loading = false;
    }
  }
}
