import { Column, Entity, OneToMany, type Relation } from 'typeorm';
import { BaseEntity } from '../../helpers/base.entity.js';
import { Membership } from '../../memberships/entities/membership.entity.js';
import { Category } from '../../categories/entities/category.entity.js';
import { Product } from '../../products/entities/product.entity.js';
import { Warehouse } from '../../warehouses/entities/warehouse.entity.js';

@Entity('companies')
export class Company extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Membership, (membership) => membership.company)
  memberships: Relation<Membership[]>;

  @OneToMany(() => Category, (category) => category.company)
  categories: Relation<Category[]>;

  @OneToMany(() => Product, (product) => product.company)
  products: Relation<Product[]>;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.company)
  warehouses: Relation<Warehouse[]>;
}
