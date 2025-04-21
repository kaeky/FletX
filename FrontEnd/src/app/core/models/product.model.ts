import { Company } from './company.model';

export interface Product {
  id?: number;
  name: string;
  category: string;
  price: number;
  companies?: Company[];
  companyIds?: number[];
}
