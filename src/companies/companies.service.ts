import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity.js';
import { EntityManager, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { toCompanyResponse } from './mappers/company-response.mapper.js';
import { ResponseCompanyDto } from './dto/response-company.dto.js';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  /**
   * Finds a company by its email address.
   *
   * @param email - The company's unique email address.
   * @returns The Company entity if found, or null otherwise.
   */
  async findByEmail(email: string): Promise<Company | null> {
    return this.companyRepo.findOneBy({
      email: email,
    });
  }

  async findByEmailOrFail(email: string): Promise<Company> {
    const company = await this.companyRepo.findOneBy({
      email: email,
    });

    if (!company)
      throw new NotFoundException(`Company with this email not found`);

    return company;
  }

  /**
   * Creates a new company record.
   *
   * Supports transactional execution by accepting an optional EntityManager.
   *
   * @param createCompanyDto - Data transfer object containing company details.
   * @param entityManager - Optional EntityManager instance for transactional operations.
   * @returns An object containing the newly created company ID.
   * @throws ConflictException - If a company with the provided email already exists.
   */
  async create(
    createCompanyDto: CreateCompanyDto,
    entityManager?: EntityManager,
  ) {
    const existingCompany = await this.findByEmail(createCompanyDto.email);

    if (existingCompany) throw new ConflictException('Email already exist');

    const repo = entityManager
      ? entityManager.getRepository(Company)
      : this.companyRepo;

    const company = await repo.save(createCompanyDto);

    return { id: company.id };
  }

  /**
   * Internal lookup method to find a company by its unique ID.
   *
   * @param companyId - The UUID of the company.
   * @returns The raw Company entity if found, or null otherwise.
   */
  async findById(companyId: string): Promise<Company | null> {
    return this.companyRepo.findOneBy({ id: companyId });
  }

  /**
   * Public-facing getter that retrieves a company by its ID and maps it to a response DTO.
   *
   * @param companyId - The UUID of the company.
   * @returns The formatted company response DTO.
   * @throws NotFoundException - If no company matches the provided ID.
   */
  async findByIdOrFail(companyId: string): Promise<ResponseCompanyDto> {
    if (!isUUID(companyId)) {
      throw new BadRequestException('Invalid ID');
    }

    const company = await this.findById(companyId);

    if (!company)
      throw new NotFoundException(`Company with ID = ${companyId} not found`);

    return toCompanyResponse(company);
  }

  /**
   * Internal lookup method to find all companies associated with a specific user via memberships.
   *
   * @param userId - The UUID of the user.
   * @returns An array of Company entities with their memberships relation loaded.
   */
  async findByUser(userId: string): Promise<Company[]> {
    return this.companyRepo.find({
      where: {
        memberships: {
          userId,
        },
      },

      relations: {
        memberships: true,
      },
    });
  }

  /**
   * Public-facing getter that retrieves all companies associated with a user and maps them to response DTOs.
   *
   * @param userId - The UUID of the user.
   * @returns An array of formatted company response DTOs.
   * @throws NotFoundException - If the user does not belong to any companies.
   */
  async findByUserOrFail(userId: string): Promise<ResponseCompanyDto[]> {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const companies = await this.findByUser(userId);

    if (companies.length === 0)
      throw new NotFoundException('You does not belong to any company');

    return companies.map((company) => toCompanyResponse(company));
  }
}
