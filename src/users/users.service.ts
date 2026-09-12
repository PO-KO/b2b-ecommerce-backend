import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { toUserResponse } from './mappers/user-response.mapper.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(newUser: CreateUserDto, entityManager?: EntityManager) {
    const repository = entityManager
      ? entityManager.getRepository(User)
      : this.userRepo;

    const existingUser = await repository.findOneBy({
      email: newUser.email,
    });

    if (existingUser) throw new ConflictException('Email already exist');

    const user = repository.create(newUser);

    return await repository.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOneBy({
      email: email,
    });

    return user;
  }

  async findByEmailOrFail(email: string) {
    const user = await this.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    return toUserResponse(user);
  }

  async findById(userId: string) {
    const user = this.userRepo.findOne({
      where: { id: userId },
    });

    return user;
  }

  async findByIdOrFail(userId: string) {
    const user = await this.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    return toUserResponse(user);
  }

  async updateRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
    entityManager?: EntityManager,
  ) {
    const repository = entityManager
      ? entityManager.getRepository(User)
      : this.userRepo;

    return await repository.update(
      { id: userId },
      {
        refreshToken: hashedRefreshToken,
      },
    );
  }
}
