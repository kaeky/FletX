import { User } from './user.model';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  position: string;
  salary: number;
  phone: string;
  email: string;
  password: string;
  role?: string;
  companyId?: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
