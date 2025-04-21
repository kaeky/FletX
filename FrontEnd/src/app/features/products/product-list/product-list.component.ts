import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-list',
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
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'companies', 'actions'];
  loading = true;
  isAdmin = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.isAdmin = this.authService.getUserRole() === 'admin';
  }

  async loadProducts(): Promise<void> {
    try {
      this.loading = true;
      this.products = await this.productService.getProducts();
    } catch (error) {
      this.snackBar.open('Error loading products', 'Close', { duration: 3000 });
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async deleteProduct(id: number | undefined): Promise<void> {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        if (!id) {
          throw new Error('Product ID is undefined');
        }
        await this.productService.deleteProduct(id);
        this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
        this.loadProducts();
      } catch (error) {
        this.snackBar.open('Error deleting product', 'Close', { duration: 3000 });
        console.error(error);
      }
    }
  }
}
