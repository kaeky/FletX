import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpBaseService } from './http-base.service';
import { Department } from '../models/deparment.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends HttpBaseService {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  async getDepartments(): Promise<Department[]> {
    return this.get<Department[]>('departments');
  }

  async getDepartmentById(id: number): Promise<Department> {
    return this.get<Department>(`departments/${id}`);
  }
}
