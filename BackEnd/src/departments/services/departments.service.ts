import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Department } from '../entities/department.entity';

interface DepartmentData {
  name: string;
  code: string;
}

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentsRepository.find();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { id },
      relations: ['cities'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async loadInitialData(): Promise<void> {
    const count = await this.departmentsRepository.count();

    if (count === 0) {
      try {
        const dataPath = path.join(process.cwd(), 'data/departments.json');
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(fileContent) as DepartmentData[];

        const departments = data.map((item: DepartmentData) => {
          return this.departmentsRepository.create({
            name: item.name,
            code: item.code,
          });
        });

        await this.departmentsRepository.save(departments);
      } catch {
        throw new Error('Failed to load initial data');
      }
    }
  }
}
