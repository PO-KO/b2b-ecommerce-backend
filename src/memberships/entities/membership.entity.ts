import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
  type Relation,
} from 'typeorm';
import { BaseEntity } from '../../helpers/base.entity.js';
import { MembershipRole } from '../enums/membership-role.enum.js';
import { User } from '../../users/entities/user.entity.js';
import { Company } from '../../companies/entities/company.entity.js';

@Entity('memberships')
@Unique(['user', 'company'])
export class Membership extends BaseEntity {
  @Column({ type: 'enum', enum: MembershipRole, default: MembershipRole.USER })
  role: MembershipRole;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.memberships)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, (company) => company.memberships)
  @JoinColumn({ name: 'companyId' })
  company: Relation<Company>;
}
