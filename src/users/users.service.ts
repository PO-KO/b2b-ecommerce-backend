import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(newUser: CreateUserDto) {
    const existingUser = await this.userRepo.findOneBy({
      email: newUser.email,
    });

    if (existingUser) throw new ConflictException('Email already exist');

    const user = this.userRepo.create(newUser);

    return await this.userRepo.save(user);
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepo.findOneBy({
      email: email,
    });

    return user;
  }

  async findUserById(userId: string, withRefreshToken: boolean = false) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        refreshToken: withRefreshToken,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
    return await this.userRepo.update(
      { id: userId },
      {
        refreshToken: hashedRefreshToken,
      },
    );
  }
}
