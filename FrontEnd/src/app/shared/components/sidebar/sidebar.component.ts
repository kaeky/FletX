import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgForOf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
  roles?: UserRole[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    MatNavList,
    RouterLink,
    RouterLinkActive,
    MatListItem,
    MatIconModule,
    NgForOf,
  ],
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      routerLink: '/dashboard'
    },
    {
      label: 'Companies',
      icon: 'business',
      routerLink: '/companies'
    },
    {
      label: 'Products',
      icon: 'shopping_cart',
      routerLink: '/products'
    },
    {
      label: 'Users',
      icon: 'people',
      routerLink: '/users',
      roles: [UserRole.ADMIN]
    }
  ];

  userRole: UserRole | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() as UserRole;
  }

  hasPermission(item: MenuItem): boolean {
    // If no roles are specified, everyone has access
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    // Check if user role is in the allowed roles
    return !!this.userRole && item.roles.includes(this.userRole);
  }
}
