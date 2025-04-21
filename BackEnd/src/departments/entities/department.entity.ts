import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { City } from '../../cities/entities/city.entity';

@Entity('dim_departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 10, nullable: true })
  code: string;

  @OneToMany(() => City, (city) => city.department)
  cities: City[];
}
