import { City } from './city.model';

export interface Department {
  id: number;
  name: string;
  code: string;
  cities?: City[];
}
