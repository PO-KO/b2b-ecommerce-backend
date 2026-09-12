import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity.js';
import { UsersModule } from '../users/users.module.js';
import { CompaniesModule } from '../companies/companies.module.js';
import { MembershipsController } from './memberships.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership]),
    UsersModule,
    CompaniesModule,
  ],
  providers: [MembershipsService],
  exports: [MembershipsService],
  controllers: [MembershipsController],
})
export class MembershipsModule {}
