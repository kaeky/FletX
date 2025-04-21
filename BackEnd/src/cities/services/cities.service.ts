import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { City } from '../entities/city.entity';
import { Department } from '../../departments/entities/department.entity';

interface CityData {
  name: string;
  code: string;
  departmentCode: string;
}

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<City[]> {
    return this.citiesRepository.find({
      relations: ['department'],
    });
  }

  async findOne(id: number): Promise<City> {
    const city = await this.citiesRepository.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }

    return city;
  }

  async findByDepartment(departmentId: number): Promise<City[]> {
    return this.citiesRepository.find({
      where: { department: { id: departmentId } },
      relations: ['department'],
    });
  }

  async loadInitialData(): Promise<void> {
    const count = await this.citiesRepository.count();

    if (count === 0) {
      try {
        const dataPath = path.join(process.cwd(), 'data/cities.json');
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(fileContent) as CityData[];

        for (const item of data) {
          const department = await this.departmentsRepository.findOne({
            where: { code: item.departmentCode },
          });

          if (department) {
            const city = this.citiesRepository.create({
              name: item.name,
              code: item.code,
              department,
            });

            await this.citiesRepository.save(city);
          }
        }
      } catch {
        throw new Error('Error loading initial data for cities');
      }
    }
  }
}
