import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userExists) {
      throw new ConflictException('Email already exists');
    }
    const user = this.usersRepository.create({
      ...createUserDto,
      ...(createUserDto?.companyId && {
        company: { id: createUserDto.companyId },
      }),
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['company'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const userWithEmail = await this.findByEmail(updateUserDto.email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    // Si hay contraseña, será hasheada por el hook BeforeUpdate
    const updated = Object.assign(user, {
      ...updateUserDto,
      ...(updateUserDto?.companyId && {
        company: { id: updateUserDto.companyId },
      }),
    });
    return this.usersRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
