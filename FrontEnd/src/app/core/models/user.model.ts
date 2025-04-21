import { Company } from './company.model';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  position: string;
  salary: number;
  phone: string;
  email: string;
  password?: string;
  role?: UserRole;
  companyId?: number;
  company?: Company;
}
