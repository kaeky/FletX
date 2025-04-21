import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyService } from '../../../core/services/company.service';
import { AuthService } from '../../../core/services/auth.service';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  company: Company | null = null;
  loading = true;
  error = '';
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 'admin';
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.loadCompany(+companyId);
    } else {
      this.error = 'Company ID is missing';
      this.loading = false;
    }
  }

  async loadCompany(id: number): Promise<void> {
    try {
      this.loading = true;
      this.company = await this.companyService.getCompanyById(id);
    } catch (error) {
      this.error = 'Failed to load company details';
      console.error('Error loading company:', error);
      this.snackBar.open(this.error, 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async deleteCompany(): Promise<void> {
    if (!this.company) return;

    if (confirm(`Are you sure you want to delete ${this.company.name}?`)) {
      try {
        this.loading = true;
        await this.companyService.deleteCompany(this.company.id!);
        this.snackBar.open('Company deleted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/companies']);
      } catch (error) {
        this.error = 'Failed to delete company';
        console.error('Error deleting company:', error);
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      } finally {
        this.loading = false;
      }
    }
  }
}
