import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'position', 'company', 'actions'];
  loading = true;
  isAdmin = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.isAdmin = this.authService.getUserRole() === 'admin';
  }

  async loadUsers(): Promise<void> {
    try {
      this.loading = true;
      this.users = await this.userService.getUsers();
    } catch (error) {
      this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async deleteUser(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await this.userService.deleteUser(id);
        this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        this.loadUsers();
      } catch (error) {
        this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
        console.error(error);
      }
    }
  }
}
