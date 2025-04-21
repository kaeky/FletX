import { Company } from './company.model';
import { Department } from './deparment.model';


export interface City {
  id: number;
  name: string;
  code: string;
  department?: Department;
  departmentId?: number;
  companies?: Company[];
}
