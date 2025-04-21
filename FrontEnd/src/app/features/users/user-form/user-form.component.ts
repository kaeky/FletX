import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { CompanyService } from '../../../core/services/company.service';
import { UserRole } from '../../../core/models/user.model';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  loading = false;
  companies: Company[] = [];
  roles = Object.values(UserRole);
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      position: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      role: [UserRole.USER, [Validators.required]],
      companyId: [null]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;
      this.isEditMode = true;
      this.loadUser(this.userId);

      // Remove password validation for edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  async loadCompanies(): Promise<void> {
    try {
      this.companies = await this.companyService.getCompanies();
    } catch (error) {
      console.error('Error loading companies:', error);
      this.snackBar.open('Failed to load companies', 'Close', { duration: 3000 });
    }
  }

  async loadUser(id: number): Promise<void> {
    try {
      this.loading = true;
      const user = await this.userService.getUserById(id);

      this.userForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        position: user.position,
        salary: user.salary,
        phone: user.phone,
        email: user.email,
        role: user.role,
        companyId: user.company?.id || null
      });
    } catch (error) {
      console.error('Error loading user:', error);
      this.snackBar.open('Error loading user data', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      const userData = this.userForm.value;

      if (this.isEditMode && this.userId) {
        if (!userData.password) {
          delete userData.password; // Don't update password if empty
        }
        await this.userService.updateUser(this.userId, userData);
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
      } else {
        await this.userService.createUser(userData);
        this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
      }

      this.router.navigate(['/users']);
    } catch (error) {
      console.error('Error saving user:', error);
      this.snackBar.open('Error saving user', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }
}
