import { ResponseUserDto } from '../dto/response-user.dto.js';
import { User } from '../entities/user.entity.js';

export const toUserResponse = (user: User): ResponseUserDto => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  createdAt: user.createdAt,
  ...(user.updatedAt && { updatedAt: user.updatedAt }),
});
