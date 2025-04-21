import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Company } from '../entities/company.entity';
import { City } from '../../cities/entities/city.entity';
import { Department } from '../../departments/entities/department.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companiesRepo: Repository<Company>;
  let citiesRepo: Repository<City>;
  let departmentsRepo: Repository<Department>;
  let productsRepo: Repository<Product>;
  let usersRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: getRepositoryToken(Company), useClass: Repository },
        { provide: getRepositoryToken(City), useClass: Repository },
        { provide: getRepositoryToken(Department), useClass: Repository },
        { provide: getRepositoryToken(Product), useClass: Repository },
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    companiesRepo = module.get(getRepositoryToken(Company));
    citiesRepo = module.get(getRepositoryToken(City));
    departmentsRepo = module.get(getRepositoryToken(Department));
    productsRepo = module.get(getRepositoryToken(Product));
    usersRepo = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const city = { id: 1 } as City;
      const department = { id: 1 } as Department;
      const createCompanyDto: CreateCompanyDto = {
        name: 'Company A',
        sector: 'Sector A',
        cityId: 1,
        departmentId: 1,
        phone: '123456789',
        address: 'Address A',
        assets: 1000,
        liabilities: 500,
        productIds: [1, 2],
      };
      const products = [{ id: 1 }, { id: 2 }] as Product[];
      const company = {
        id: 1,
        ...createCompanyDto,
        city,
        department,
        users: [],
        products: [],
      } as Company;

      jest.spyOn(citiesRepo, 'findOne').mockResolvedValue(city);
      jest.spyOn(departmentsRepo, 'findOne').mockResolvedValue(department);
      jest.spyOn(productsRepo, 'findByIds').mockResolvedValue(products);
      jest.spyOn(companiesRepo, 'create').mockReturnValue(company);
      jest.spyOn(companiesRepo, 'save').mockResolvedValue(company);

      const result = await service.create(createCompanyDto);

      expect(result).toEqual(company);
      expect(citiesRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(departmentsRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(productsRepo.findByIds).toHaveBeenCalledWith([1, 2]);
      expect(companiesRepo.create).toHaveBeenCalledWith({
        address: 'Address A',
        assets: 1000,
        city: { id: 1 },
        department: { id: 1 },
        liabilities: 500,
        name: 'Company A',
        phone: '123456789',
        sector: 'Sector A',
      });
      expect(companiesRepo.save).toHaveBeenCalledWith(company);
    });

    it('should throw NotFoundException if city is not found', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Company A',
        sector: 'Sector A',
        cityId: 1,
        departmentId: 1,
        phone: '123456789',
        address: 'Address A',
        assets: 1000,
        liabilities: 500,
        productIds: [1, 2],
      };

      jest.spyOn(citiesRepo, 'findOne').mockResolvedValue(null);

      await expect(service.create(createCompanyDto)).rejects.toThrow(
        new NotFoundException(`City with ID 1 not found`),
      );
    });
  });

  describe('findOne', () => {
    it('should return a company if found', async () => {
      const company = { id: 1 } as Company;

      jest.spyOn(companiesRepo, 'findOne').mockResolvedValue(company);

      const result = await service.findOne(1);

      expect(result).toEqual(company);
      expect(companiesRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['city', 'department', 'products', 'users'],
      });
    });

    it('should throw NotFoundException if company is not found', async () => {
      jest.spyOn(companiesRepo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException(`Company with ID 1 not found`),
      );
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const company = { id: 1, name: 'Company A' } as Company;
      const updateCompanyDto: UpdateCompanyDto = { name: 'Updated Company A' };

      jest.spyOn(service, 'findOne').mockResolvedValue(company);
      jest.spyOn(companiesRepo, 'save').mockResolvedValue({
        ...company,
        ...updateCompanyDto,
      });

      const result = await service.update(1, updateCompanyDto);

      expect(result).toEqual({ ...company, ...updateCompanyDto });
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(companiesRepo.save).toHaveBeenCalledWith({
        ...company,
        ...updateCompanyDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a company', async () => {
      const company = { id: 1 } as Company;

      jest.spyOn(service, 'findOne').mockResolvedValue(company);
      jest.spyOn(companiesRepo, 'remove').mockResolvedValue(company);

      await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(companiesRepo.remove).toHaveBeenCalledWith(company);
    });
  });

  describe('findByUserId', () => {
    it('should return companies for a user if found', async () => {
      const user = { id: 1, company: { id: 1 } } as User;

      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(user);

      const result = await service.findByUserId(1);

      expect(result).toEqual([user.company]);
      expect(usersRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['company'],
      });
    });

    it('should return an empty array if user or company is not found', async () => {
      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(null);

      const result = await service.findByUserId(1);

      expect(result).toEqual([]);
    });
  });

  describe('checkUserAccess', () => {
    it('should return true if user has access to the company', async () => {
      const user = { id: 1, company: { id: 1 } } as User;

      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(user);

      const result = await service.checkUserAccess(1, 1);

      expect(result).toBe(true);
    });

    it('should return false if user does not have access to the company', async () => {
      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(null);

      const result = await service.checkUserAccess(1, 1);

      expect(result).toBe(false);
    });
  });
});
