import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Company } from '../../companies/entities/company.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { companyIds, ...productData } = createProductDto;

    const product = this.productsRepository.create(productData);

    if (companyIds && companyIds.length > 0) {
      product.companies = await this.companiesRepository.findByIds(companyIds);
    }

    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['companies'],
    });
  }

  async findOne(
    id: number,
    userId?: number,
    userRole?: string,
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['companies'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (userRole !== 'admin' && userId) {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['company'],
      });

      if (user && user.company) {
        product.companies = product.companies.filter(
          (company) => company.id === user.company.id,
        );
      } else {
        product.companies = [];
      }
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    const { companyIds, ...productData } = updateProductDto;

    if (companyIds) {
      product.companies = await this.companiesRepository.findByIds(companyIds);
    }

    Object.assign(product, productData);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async findByUserId(userId: number): Promise<Product[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['company', 'company.products'],
    });

    if (!user || !user.company) {
      return [];
    }

    return user.company.products || [];
  }

  async checkUserAccess(productId: number, userId: number): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['company', 'company.products'],
    });

    if (!user || !user.company || !user.company.products) {
      return false;
    }

    return user.company.products.some((product) => product.id === productId);
  }
}
