import { User } from './user.model';
import { Product } from './product.model';
import { City } from './city.model';
import { Department } from './deparment.model';

export interface Company {
  id?: number;
  name: string;
  sector: string;
  city?: City;
  cityId: number;
  department?: Department;
  departmentId: number;
  phone: string;
  address: string;
  assets: number;
  liabilities: number;
  users?: User[];
  products?: Product[];
  productIds?: number[];
}
