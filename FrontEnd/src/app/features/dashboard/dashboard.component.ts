import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../core/services/company.service';
import { ProductService } from '../../core/services/product.service';
import { UserService } from '../../core/services/user.service';
import { Company } from '../../core/models/company.model';
import { Product } from '../../core/models/product.model';
import { User } from '../../core/models/user.model';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    MatProgressSpinnerModule,
    MatCard,
    MatCardContent,
    MatIconModule,
    MatListItem,
    MatCardActions,
    MatList,
    NgForOf,
    NgIf,
    MatButton,
    MatFormFieldModule,
    RouterLink,
  ],
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  companies: Company[] = [];
  products: Product[] = [];
  users: User[] = [];

  totalCompanies = 0;
  totalProducts = 0;
  totalUsers = 0;

  loading = true;
  error = '';

  constructor(
    private companyService: CompanyService,
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    try {
      this.loading = true;

      // Load data in parallel
      const [companies, products, users] = await Promise.all([
        this.companyService.getCompanies(),
        this.productService.getProducts(),
        this.userService.getUsers()
      ]);

      this.companies = companies;
      this.products = products;
      this.users = users;

      this.totalCompanies = companies.length;
      this.totalProducts = products.length;
      this.totalUsers = users.length;

      this.error = '';
    } catch (error) {
      this.error = 'Failed to load dashboard data. Please try again later.';
      console.error('Dashboard loading error:', error);
    } finally {
      this.loading = false;
    }
  }
}
