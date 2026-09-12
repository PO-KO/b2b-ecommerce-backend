import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
  type Relation,
} from 'typeorm';
import { BaseEntity } from '../../helpers/base.entity.js';
import { Company } from '../../companies/entities/company.entity.js';
import { Category } from '../../categories/entities/category.entity.js';

@Unique(['companyId', 'sku'])
@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('int')
  priceInCents: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  sku: string;

  @Column()
  companyId: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => Company, (company) => company.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: Relation<Company>;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Relation<Category>;
}
