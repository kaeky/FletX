import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { City } from '../../cities/entities/city.entity';
import { Department } from '../../departments/entities/department.entity';
import { Product } from '../../products/entities/product.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { cityId, departmentId, productIds, ...companyData } =
      createCompanyDto;

    const city = await this.citiesRepository.findOne({ where: { id: cityId } });
    if (!city) {
      throw new NotFoundException(`City with ID ${cityId} not found`);
    }

    const department = await this.departmentsRepository.findOne({
      where: { id: departmentId },
    });
    if (!department) {
      throw new NotFoundException(
        `Department with ID ${departmentId} not found`,
      );
    }

    const company = this.companiesRepository.create({
      ...companyData,
      city,
      department,
    });

    if (productIds && productIds.length > 0) {
      company.products = await this.productsRepository.findByIds(productIds);
    }

    return this.companiesRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find({
      relations: ['city', 'department', 'products'],
    });
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['city', 'department', 'products', 'users'],
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.findOne(id);
    const { cityId, departmentId, productIds, ...companyData } =
      updateCompanyDto;

    if (cityId) {
      const city = await this.citiesRepository.findOne({
        where: { id: cityId },
      });
      if (!city) {
        throw new NotFoundException(`City with ID ${cityId} not found`);
      }
      company.city = city;
    }

    if (departmentId) {
      const department = await this.departmentsRepository.findOne({
        where: { id: departmentId },
      });
      if (!department) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found`,
        );
      }
      company.department = department;
    }

    if (productIds) {
      company.products = await this.productsRepository.findByIds(productIds);
    }

    Object.assign(company, companyData);
    return this.companiesRepository.save(company);
  }

  async remove(id: number): Promise<void> {
    const company = await this.findOne(id);
    await this.companiesRepository.remove(company);
  }
}
