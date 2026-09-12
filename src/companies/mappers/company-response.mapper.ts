import { ResponseCompanyDto } from '../dto/response-company.dto.js';
import { Company } from '../entities/company.entity.js';

export const toCompanyResponse = (company: Company): ResponseCompanyDto => ({
  id: company.id,
  name: company.name,
  email: company.email,
  ...(company.phone && { phone: company.phone }),
  ...(company.address && { address: company.address }),
  createdAt: company.createdAt,
  ...(company.updatedAt && { updatedAt: company.updatedAt }),
});
