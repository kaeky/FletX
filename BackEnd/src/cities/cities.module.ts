import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Department } from '../departments/entities/department.entity';
import { CitiesController } from './controllers/cities.controller';
import { CitiesService } from './services/cities.service';

@Module({
  imports: [TypeOrmModule.forFeature([City, Department])],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule implements OnModuleInit {
  constructor(private readonly citiesService: CitiesService) {}

  async onModuleInit() {
    // Cargar datos iniciales de ciudades
    await this.citiesService.loadInitialData();
  }
}
