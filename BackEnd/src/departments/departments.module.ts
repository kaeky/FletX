import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { DepartmentsController } from './controllers/departments.controller';
import { DepartmentsService } from './services/departments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule implements OnModuleInit {
  constructor(private readonly departmentsService: DepartmentsService) {}

  async onModuleInit() {
    await this.departmentsService.loadInitialData();
  }
}
