import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  type Relation,
} from 'typeorm';
import { BaseEntity } from '../../helpers/base.entity.js';
import * as bcrypt from 'bcrypt';
import { Membership } from '../../memberships/entities/membership.entity.js';

@Entity('users')
export class User extends BaseEntity {
  @Column('varchar', { length: '30' })
  firstName: string;

  @Column('varchar', { length: '30' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string | null;

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Relation<Membership[]>;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
