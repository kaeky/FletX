import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpBaseService } from './http-base.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends HttpBaseService {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  async getProducts(): Promise<Product[]> {
    return this.get<Product[]>('products');
  }

  async getProductById(id: number): Promise<Product> {
    return this.get<Product>(`products/${id}`);
  }

  async createProduct(product: Product): Promise<Product> {
    return this.post<Product>('products', product);
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    return this.patch<Product>(`products/${id}`, product);
  }

  async deleteProduct(id: number): Promise<void> {
    return this.delete<void>(`products/${id}`);
  }
}
