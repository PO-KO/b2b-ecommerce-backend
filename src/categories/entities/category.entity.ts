import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
  type Relation,
} from 'typeorm';
import { BaseEntity } from '../../helpers/base.entity.js';
import { Company } from '../../companies/entities/company.entity.js';
import { Product } from '../../products/entities/product.entity.js';

@Entity('categories')
@Unique(['companyId', 'name'])
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  parentId: string;

  @Column()
  companyId: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Relation<Category> | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Relation<Category[]>;

  @ManyToOne(() => Company, (company) => company.categories, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  company: Relation<Company>;

  @OneToMany(() => Product, (product) => product.category)
  products: Relation<Product[]>;
}
