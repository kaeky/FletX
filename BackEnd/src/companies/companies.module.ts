import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { City } from '../cities/entities/city.entity';
import { Department } from '../departments/entities/department.entity';
import { Product } from '../products/entities/product.entity';
import { CompaniesController } from './controllers/companies.controller';
import { CompaniesService } from './services/companies.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, City, Department, Product, User]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
