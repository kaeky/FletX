import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { CompanyService } from '../../../core/services/company.service';
import { Company } from '../../../core/models/company.model';
import { UserRole } from '../../../core/models/user.model';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInput,
    MatProgressSpinnerModule,
    MatCardActions,
    MatAnchor,
    RouterLink,
    MatIconButton,
    MatSelectModule,
    MatInputModule,
    MatButton,
    MatCardTitle,
    NgIf,
    NgForOf,
  ],
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  companies: Company[] = [];
  loadingCompanies = false;
  roles = Object.values(UserRole);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private companyService: CompanyService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    // Initialize form
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      position: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.USER, [Validators.required]],
      companyId: [null]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  // Getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  async loadCompanies(): Promise<void> {
    try {
      this.loadingCompanies = true;
      this.companies = await this.companyService.getCompanies();
    } catch (error) {
      console.error('Error loading companies:', error);
      this.snackBar.open('Failed to load companies', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.loadingCompanies = false;
    }
  }

  async onSubmit(): Promise<void> {
    // Stop if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      const userData = {
        firstName: this.f['firstName'].value,
        lastName: this.f['lastName'].value,
        position: this.f['position'].value,
        salary: this.f['salary'].value,
        phone: this.f['phone'].value,
        email: this.f['email'].value,
        password: this.f['password'].value,
        role: this.f['role'].value,
        companyId: this.f['companyId'].value
      };

      await this.authService.register(userData);

      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
    } catch (error) {
      let errorMessage = 'Registration failed';

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
