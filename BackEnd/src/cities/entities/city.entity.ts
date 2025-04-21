import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('dim_cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 10, nullable: true })
  code: string;

  @ManyToOne(() => Department, (department) => department.cities)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => Company, (company) => company.city)
  companies: Company[];
}
