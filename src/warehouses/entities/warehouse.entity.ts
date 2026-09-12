import { Column, Entity, JoinColumn, ManyToOne, type Relation } from 'typeorm';
import { Company } from '../../companies/entities/company.entity.js';
import { BaseEntity } from '../../helpers/base.entity.js';

@Entity('warehouses')
export class Warehouse extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, (company) => company.warehouses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: Relation<Company>;
}
