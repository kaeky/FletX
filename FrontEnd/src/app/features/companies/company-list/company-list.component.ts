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
import { CompanyService } from '../../../core/services/company.service';
import { AuthService } from '../../../core/services/auth.service';
import { Company } from '../../../core/models/company.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-company-list',
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
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  displayedColumns: string[] = ['id', 'name', 'sector', 'location', 'financials', 'actions'];
  loading = true;
  isAdmin = false;

  constructor(
    private companyService: CompanyService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.isAdmin = this.authService.getUserRole() === 'admin';
  }

  async loadCompanies(): Promise<void> {
    try {
      this.loading = true;
      this.companies = await this.companyService.getCompanies();
    } catch (error) {
      this.snackBar.open('Error loading companies', 'Close', { duration: 3000 });
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async deleteCompany(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        await this.companyService.deleteCompany(id);
        this.snackBar.open('Company deleted successfully', 'Close', { duration: 3000 });
        this.loadCompanies();
      } catch (error) {
        this.snackBar.open('Error deleting company', 'Close', { duration: 3000 });
        console.error(error);
      }
    }
  }
}
