import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DepartmentsService } from '../services/departments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(+id);
  }
}
