import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { Company } from '../../companies/entities/company.entity';
import { User } from '../../users/entities/user.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: Repository<Product>;
  let companiesRepository: Repository<Company>;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Company),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    companiesRepository = module.get<Repository<Company>>(
      getRepositoryToken(Company),
    );
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a product along with associated companies', async () => {
      const createProductDto = {
        name: 'Test Product',
        category: 'Test Category',
        price: 100,
        companyIds: [1, 2],
        companies: [
          {
            id: 2,
          } as Company,
        ],
      };
      const mockCompanies = [{ id: 1 }, { id: 2 }];
      const mockProduct = { ...createProductDto, id: 1 };

      jest
        .spyOn(productsRepository, 'create')
        .mockReturnValue(mockProduct as any);
      jest
        .spyOn(companiesRepository, 'findByIds')
        .mockResolvedValue(mockCompanies as any);
      jest.spyOn(productsRepository, 'save').mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(productsRepository.create).toHaveBeenCalledWith({
        name: createProductDto.name,
        category: createProductDto.category,
        price: createProductDto.price,
        companies: [{ id: 2 }],
      });
      expect(companiesRepository.findByIds).toHaveBeenCalledWith(
        createProductDto.companyIds,
      );
      expect(productsRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return an array of products with relations', async () => {
      const mockProducts = [{ id: 1, name: 'Test Product', companies: [] }];
      jest
        .spyOn(productsRepository, 'find')
        .mockResolvedValue(mockProducts as any);

      const result = await service.findAll();

      expect(productsRepository.find).toHaveBeenCalledWith({
        relations: ['companies'],
      });
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findOne', () => {
    it('should return a product by id if it exists', async () => {
      const mockProduct = { id: 1, name: 'Test Product', companies: [] };
      jest
        .spyOn(productsRepository, 'findOne')
        .mockResolvedValue(mockProduct as any);

      const result = await service.findOne(1);

      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['companies'],
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      jest.spyOn(productsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product by id', async () => {
      const updateProductDto = {
        name: 'Updated Product',
        category: 'Updated Category',
        price: 200,
        companyIds: [1],
      };
      const mockCompanies = [{ id: 1 }];
      const mockProduct = {
        id: 1,
        name: 'Product A',
        category: 'Category A',
        price: 99.99,
        companies: [],
        companyIds: [1],
      } as Product;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct as any);
      jest
        .spyOn(companiesRepository, 'findByIds')
        .mockResolvedValue(mockCompanies as any);
      jest.spyOn(productsRepository, 'save').mockResolvedValue(mockProduct);

      const result = await service.update(1, updateProductDto);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(companiesRepository.findByIds).toHaveBeenCalledWith(
        updateProductDto.companyIds,
      );
      expect(productsRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        ...updateProductDto,
        companies: mockCompanies,
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('remove', () => {
    it('should delete a product by id', async () => {
      const mockProduct = { id: 1, name: 'Test Product' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct as any);
      jest
        .spyOn(productsRepository, 'remove')
        .mockResolvedValue(mockProduct as any);

      await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(productsRepository.remove).toHaveBeenCalledWith(mockProduct);
    });
  });
});
