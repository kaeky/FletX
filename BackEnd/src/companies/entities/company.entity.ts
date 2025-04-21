import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { City } from '../../cities/entities/city.entity';
import { Department } from '../../departments/entities/department.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('dim_companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  sector: string;

  @ManyToOne(() => City, (city) => city.companies)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 200 })
  address: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  assets: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  liabilities: number;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @ManyToMany(() => Product, (product) => product.companies)
  @JoinTable({
    name: 'dim_company_products',
    joinColumn: { name: 'company_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];
}
