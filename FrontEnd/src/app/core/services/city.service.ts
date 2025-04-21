import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpBaseService } from './http-base.service';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class CityService extends HttpBaseService {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  async getCities(): Promise<City[]> {
    return this.get<City[]>('cities');
  }

  async getCityById(id: number): Promise<City> {
    return this.get<City>(`cities/${id}`);
  }

  async getCitiesByDepartment(departmentId: number): Promise<City[]> {
    return this.get<City[]>(`cities/department/${departmentId}`);
  }
}
