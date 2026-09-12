import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity.js';
import { EntityManager, Repository } from 'typeorm';
import { CreateMembershipDto } from './dto/create-membership.dto.js';

import {
  toCompanyMembershipResponse,
  toMembershipResponse,
} from './mappers/membership-response.mapper.js';
import { ResponseMembershipDto } from './dto/response-membership.dto.js';
import { UsersService } from '../users/users.service.js';
import { CompaniesService } from '../companies/companies.service.js';
import { MembershipRole } from './enums/membership-role.enum.js';
import { AddMemberToCompanyDto } from './dto/add-member-to-company.dto.js';
import { ADMIN_ALLOWED_ROLES } from '../constants/roles.constants.js';
import { ResponseCompanyMembershipDto } from './dto/response-company-membership.dto.js';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(
    { userId, companyId, role }: CreateMembershipDto,
    entityManager?: EntityManager,
  ) {
    const repo = entityManager
      ? entityManager.getRepository(Membership)
      : this.membershipRepo;
    return repo.save({ userId, companyId, role });
  }

  async createOrFail(
    createMembershipDto: CreateMembershipDto,
    entityManager?: EntityManager,
  ): Promise<ResponseMembershipDto> {
    const { userId, companyId } = createMembershipDto;

    // await this.usersService.findByIdOrFail(userId);
    // await this.companiesService.findByIdOrFail(companyId);

    const membershipExistence = await this.findByUserAndCompany(
      userId,
      companyId,
    );

    if (membershipExistence)
      throw new ConflictException('User already belongs to this company');

    const membership = await this.create(createMembershipDto, entityManager);

    return toMembershipResponse(membership);
  }

  async findByUserOrFail(userId: string): Promise<ResponseMembershipDto[]> {
    const memberships = await this.findByUser(userId);
    if (memberships.length === 0)
      throw new NotFoundException('This user does not belong to any company');

    return memberships.map((memsh) => toMembershipResponse(memsh));
  }

  async findByCompanyOrFail(
    companyId: string,
  ): Promise<ResponseCompanyMembershipDto[]> {
    const memberships = await this.findByCompany(companyId);
    if (memberships.length === 0)
      throw new NotFoundException('This company does not have any members');

    return memberships.map((memsh) => toCompanyMembershipResponse(memsh));
  }

  async findByUserAndCompanyOrFail(userId: string, companyId: string) {
    const membership = await this.findByUserAndCompany(userId, companyId);
    if (!membership)
      throw new NotFoundException('This membership does not exist');

    return toCompanyMembershipResponse(membership);
  }

  async findByIdOrFail(id: string): Promise<ResponseMembershipDto> {
    const membership = await this.findById(id);

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return toMembershipResponse(membership);
  }

  async findById(id: string): Promise<Membership | null> {
    return this.membershipRepo.findOne({ where: { id } });
  }

  async findByUser(userId: string): Promise<Membership[]> {
    return this.membershipRepo.find({
      where: { userId },
      relations: { company: true },
    });
  }

  async findByCompany(companyId: string): Promise<Membership[]> {
    return this.membershipRepo.find({
      where: { companyId },
      relations: { user: true },
    });
  }

  async findByUserAndCompany(
    userId: string,
    companyId: string,
  ): Promise<Membership | null> {
    return this.membershipRepo.findOne({
      where: {
        companyId,
        userId,
      },
      relations: {
        user: true,
        company: true,
      },
    });
  }

  async addMemberToCompany(
    dto: AddMemberToCompanyDto,
    companyId: string,
    currentUserId: string,
  ) {
    if (dto.role === MembershipRole.OWNER)
      throw new ForbiddenException(
        `You can not assign role ${MembershipRole.OWNER}`,
      );

    const currentMembership = await this.findByUserAndCompanyOrFail(
      currentUserId,
      companyId,
    );

    if (
      currentMembership.role === MembershipRole.ADMIN &&
      !ADMIN_ALLOWED_ROLES.includes(dto.role)
    ) {
      throw new ForbiddenException(
        `Admins can only assign ${ADMIN_ALLOWED_ROLES.join(' or ')} roles`,
      );
    }

    const membership = await this.createOrFail({ ...dto, companyId });

    return membership;
  }

  async removeMembership(id: string) {
    return this.membershipRepo.delete({ id });
  }

  async removeMemberOrFail(
    userId: string,
    companyId: string,
    currentUserId: string,
  ) {
    if (userId === currentUserId) {
      throw new ForbiddenException(`You can not delete your membership`);
    }

    const currentUserMembership = await this.findByUserAndCompanyOrFail(
      currentUserId,
      companyId,
    );

    const userMembership = await this.findByUserAndCompanyOrFail(
      userId,
      companyId,
    );

    const currentUserRole = currentUserMembership.role;
    const userRole = userMembership.role;

    if (userRole === MembershipRole.OWNER)
      throw new ForbiddenException(
        `You can not delete member with role ${MembershipRole.OWNER}`,
      );

    if (
      currentUserRole === MembershipRole.ADMIN &&
      !ADMIN_ALLOWED_ROLES.includes(userRole)
    )
      throw new ForbiddenException(
        `Admins can only delete members with ${ADMIN_ALLOWED_ROLES.join(' or ')} roles`,
      );

    const { affected } = await this.removeMembership(userMembership.id);

    if (!affected) {
      throw new NotFoundException('Membership no longer exists');
    }

    return userId;
  }

  async updateMemberRoleOrFail(
    userId: string,
    companyId: string,
    currentUserId: string,
    newUserRole: MembershipRole,
  ) {
    if (userId === currentUserId) {
      throw new ForbiddenException(`You can not change your role`);
    }

    const currentUserMembership = await this.findByUserAndCompanyOrFail(
      currentUserId,
      companyId,
    );

    const userMembership = await this.findByUserAndCompanyOrFail(
      userId,
      companyId,
    );

    const currentUserRole = currentUserMembership.role;
    const userRole = userMembership.role;

    if (userRole === newUserRole)
      throw new BadRequestException(`Member already has role ${newUserRole}`);

    if (userRole === MembershipRole.OWNER)
      throw new ForbiddenException(
        `You can not change member role ${MembershipRole.OWNER}`,
      );

    if (newUserRole === MembershipRole.OWNER) {
      throw new ForbiddenException(
        `You can not change member role to ${MembershipRole.OWNER}`,
      );
    }

    if (
      currentUserRole === MembershipRole.ADMIN &&
      !ADMIN_ALLOWED_ROLES.includes(userRole)
    )
      throw new ForbiddenException(
        `Admins can only change members roles with ${ADMIN_ALLOWED_ROLES.join(' or ')} roles`,
      );

    if (
      currentUserRole === MembershipRole.ADMIN &&
      !ADMIN_ALLOWED_ROLES.includes(newUserRole)
    )
      throw new ForbiddenException(
        `Admins can only change members roles to ${ADMIN_ALLOWED_ROLES.join(' or ')}`,
      );

    const { affected } = await this.updateMembershipRole(
      userMembership.id,
      newUserRole,
    );

    if (!affected)
      throw new InternalServerErrorException('Failed to update member role');

    return userId;
  }

  async updateMembershipRole(id: string, newRole: MembershipRole) {
    return this.membershipRepo.update({ id }, { role: newRole });
  }

  async countMembersInCompany(companyId: string) {
    return await this.membershipRepo.count({ where: { companyId } });
  }
}
