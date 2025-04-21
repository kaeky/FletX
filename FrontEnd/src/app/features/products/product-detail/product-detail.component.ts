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
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
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
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 'admin';
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(+productId);
    } else {
      this.error = 'Product ID is missing';
      this.loading = false;
    }
  }

  async loadProduct(id: number): Promise<void> {
    try {
      this.loading = true;
      this.product = await this.productService.getProductById(id);
    } catch (error) {
      this.error = 'Failed to load product details';
      console.error('Error loading product:', error);
      this.snackBar.open(this.error, 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async deleteProduct(): Promise<void> {
    if (!this.product) return;

    if (confirm(`Are you sure you want to delete ${this.product.name}?`)) {
      try {
        this.loading = true;
        await this.productService.deleteProduct(this.product.id!);
        this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/products']);
      } catch (error) {
        this.error = 'Failed to delete product';
        console.error('Error deleting product:', error);
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      } finally {
        this.loading = false;
      }
    }
  }
}
