import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Company } from '../../companies/entities/company.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a user when email does not exist', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        position: 'Developer',
        salary: 50000,
        phone: '1234567890',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.create.mockReturnValueOnce(createUserDto);
      mockRepository.save.mockResolvedValueOnce(createUserDto);

      const result = await service.create(createUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        ...(createUserDto?.companyId && {
          company: { id: createUserDto.companyId },
        }),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createUserDto);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        position: 'Developer',
        salary: 50000,
        phone: '1234567890',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValueOnce({
        email: createUserDto.email,
      });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
    });
  });

  describe('findAll', () => {
    it('should return all users with their company relations', async () => {
      const users = [{ id: 1, email: 'test@example.com' }];

      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['company'],
      });
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user when user exists', async () => {
      const user = { id: 1, email: 'test@example.com' };

      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['company'],
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['company'],
      });
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        position: 'Developer',
        salary: 50000,
        phone: '123-456-7890',
        password: 'hashedPassword123',
        role: UserRole.USER,
        company: { id: 1 } as Company,
        hashPassword: jest.fn(),
        validatePassword: jest.fn().mockResolvedValue(true),
      } as User;
      const updateUserDto: UpdateUserDto = { firstName: 'Updated' };

      jest.spyOn(service, 'findOne').mockResolvedValue(user);
      mockRepository.save.mockResolvedValue({ ...user, ...updateUserDto });

      const result = await service.update(1, updateUserDto);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...user,
        ...updateUserDto,
      });
      expect(result).toEqual({ ...user, ...updateUserDto });
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        position: 'Developer',
        salary: 50000,
        phone: '123-456-7890',
        password: 'hashedPassword123',
        role: UserRole.USER,
        company: { id: 1 } as Company,
        hashPassword: jest.fn(),
        validatePassword: jest.fn().mockResolvedValue(true),
      } as User;

      jest.spyOn(service, 'findOne').mockResolvedValue(user);
      mockRepository.remove.mockResolvedValue(user);

      await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(user);
    });
  });
});
