// src/app/features/companies/company-form/company-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CompanyService } from '../../../core/services/company.service';
import { DepartmentService } from '../../../core/services/department.service';
import { CityService } from '../../../core/services/city.service';
import { ProductService } from '../../../core/services/product.service';
import { City } from '../../../core/models/city.model';
import { Product } from '../../../core/models/product.model';
import { Department } from '../../../core/models/deparment.model';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  companyForm: FormGroup;
  isEditMode = false;
  companyId: number | null = null;
  loading = false;
  departments: Department[] = [];
  cities: City[] = [];
  products: Product[] = [];
  loadingDepartments = false;
  loadingCities = false;
  loadingProducts = false;

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private departmentService: DepartmentService,
    private cityService: CityService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.companyForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', [Validators.required]],
      assets: ['', [Validators.required, Validators.min(0)]],
      liabilities: ['', [Validators.required, Validators.min(0)]],
      productIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadProducts();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.companyId = +idParam;
      this.isEditMode = true;
      this.loadCompany(this.companyId);
    }

    // Watch for department changes to load cities
    this.companyForm.get('departmentId')?.valueChanges.subscribe(departmentId => {
      if (departmentId) {
        this.loadCitiesByDepartment(departmentId);
      } else {
        this.cities = [];
        this.companyForm.get('cityId')?.setValue(null);
      }
    });
  }

  get f() {
    return this.companyForm.controls;
  }

  async loadDepartments(): Promise<void> {
    try {
      this.loadingDepartments = true;
      this.departments = await this.departmentService.getDepartments();
    } catch (error) {
      console.error('Error loading departments:', error);
      this.snackBar.open('Failed to load departments', 'Close', { duration: 3000 });
    } finally {
      this.loadingDepartments = false;
    }
  }

  async loadCitiesByDepartment(departmentId: number): Promise<void> {
    try {
      this.loadingCities = true;
      this.cities = await this.cityService.getCitiesByDepartment(departmentId);
    } catch (error) {
      console.error('Error loading cities:', error);
      this.snackBar.open('Failed to load cities', 'Close', { duration: 3000 });
    } finally {
      this.loadingCities = false;
    }
  }

  async loadProducts(): Promise<void> {
    try {
      this.loadingProducts = true;
      this.products = await this.productService.getProducts();
    } catch (error) {
      console.error('Error loading products:', error);
      this.snackBar.open('Failed to load products', 'Close', { duration: 3000 });
    } finally {
      this.loadingProducts = false;
    }
  }

  async loadCompany(id: number): Promise<void> {
    try {
      this.loading = true;
      const company = await this.companyService.getCompanyById(id);

      // First set department to load cities
      this.companyForm.get('departmentId')?.setValue(company.department?.id);

      // Then wait for cities to load and set the form values
      await this.loadCitiesByDepartment(company.department?.id as number);

      this.companyForm.patchValue({
        name: company.name,
        sector: company.sector,
        cityId: company.city?.id,
        phone: company.phone,
        address: company.address,
        assets: company.assets,
        liabilities: company.liabilities,
        productIds: company.products?.map(product => product.id) || []
      });
    } catch (error) {
      console.error('Error loading company:', error);
      this.snackBar.open('Error loading company data', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.companyForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      const companyData = this.companyForm.value;

      if (this.isEditMode && this.companyId) {
        await this.companyService.updateCompany(this.companyId, companyData);
        this.snackBar.open('Company updated successfully', 'Close', { duration: 3000 });
      } else {
        await this.companyService.createCompany(companyData);
        this.snackBar.open('Company created successfully', 'Close', { duration: 3000 });
      }

      this.router.navigate(['/companies']);
    } catch (error) {
      console.error('Error saving company:', error);
      this.snackBar.open('Error saving company', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  compareProducts(o1: any, o2: any): boolean {
    return o1 === o2;
  }
}
