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
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProductService } from '../../../core/services/product.service';
import { CompanyService } from '../../../core/services/company.service';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-product-form',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  companies: Company[] = [];
  loadingCompanies = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      companyIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = +idParam;
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  get f() {
    return this.productForm.controls;
  }

  async loadCompanies(): Promise<void> {
    try {
      this.loadingCompanies = true;
      this.companies = await this.companyService.getCompanies();
    } catch (error) {
      console.error('Error loading companies:', error);
      this.snackBar.open('Failed to load companies', 'Close', { duration: 3000 });
    } finally {
      this.loadingCompanies = false;
    }
  }

  async loadProduct(id: number): Promise<void> {
    try {
      this.loading = true;
      const product = await this.productService.getProductById(id);

      this.productForm.patchValue({
        name: product.name,
        category: product.category,
        price: product.price,
        companyIds: product.companies?.map(company => company.id) || []
      });
    } catch (error) {
      console.error('Error loading product:', error);
      this.snackBar.open('Error loading product data', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      const productData = this.productForm.value;

      if (this.isEditMode && this.productId) {
        await this.productService.updateProduct(this.productId, productData);
        this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
      } else {
        await this.productService.createProduct(productData);
        this.snackBar.open('Product created successfully', 'Close', { duration: 3000 });
      }

      this.router.navigate(['/products']);
    } catch (error) {
      console.error('Error saving product:', error);
      this.snackBar.open('Error saving product', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  compareCompanies(o1: any, o2: any): boolean {
    return o1 === o2;
  }
}
