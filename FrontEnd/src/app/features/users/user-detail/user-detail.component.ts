import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error = '';
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 'admin';
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(+userId);
    } else {
      this.error = 'User ID is missing';
      this.loading = false;
    }
  }

  async loadUser(id: number): Promise<void> {
    try {
      this.loading = true;
      this.user = await this.userService.getUserById(id);
    } catch (error) {
      this.error = 'Failed to load user details';
      console.error('Error loading user:', error);
      this.snackBar.open(this.error, 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async deleteUser(): Promise<void> {
    if (!this.user) return;

    if (confirm(`Are you sure you want to delete ${this.user.firstName} ${this.user.lastName}?`)) {
      try {
        this.loading = true;
        await this.userService.deleteUser(this.user.id!);
        this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/users']);
      } catch (error) {
        this.error = 'Failed to delete user';
        console.error('Error deleting user:', error);
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      } finally {
        this.loading = false;
      }
    }
  }
}
