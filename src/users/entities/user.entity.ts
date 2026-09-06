import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../helpers/base.entity.js';
import * as bcrypt from 'bcrypt';

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
