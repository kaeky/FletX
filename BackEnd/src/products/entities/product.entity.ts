import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity('dim_products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToMany(() => Company, (company) => company.products)
  companies: Company[];
}
