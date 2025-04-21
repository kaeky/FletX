import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CitiesService } from '../services/cities.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('cities')
@UseGuards(JwtAuthGuard)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(+id);
  }

  @Get('department/:departmentId')
  findByDepartment(@Param('departmentId') departmentId: string) {
    return this.citiesService.findByDepartment(+departmentId);
  }
}
