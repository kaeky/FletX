import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpBaseService } from './http-base.service';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends HttpBaseService {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  async getCompanies(): Promise<Company[]> {
    return this.get<Company[]>('companies');
  }

  async getCompanyById(id: number): Promise<Company> {
    return this.get<Company>(`companies/${id}`);
  }

  async createCompany(company: Company): Promise<Company> {
    return this.post<Company>('companies', company);
  }

  async updateCompany(id: number, company: Partial<Company>): Promise<Company> {
    return this.patch<Company>(`companies/${id}`, company);
  }

  async deleteCompany(id: number): Promise<void> {
    return this.delete<void>(`companies/${id}`);
  }
}
