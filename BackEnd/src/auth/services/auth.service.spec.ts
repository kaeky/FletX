import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService - validateUser', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    position: 'Developer',
    salary: 75000,
    phone: '1234567890',
    email: 'johndoe@example.com',
    password: 'hashedpassword',
    role: 'USER',
    company: null,
    validatePassword: jest.fn(),
    hashPassword: jest.fn(),
  } as any;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('valid_jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should return the user if email and password are valid', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(mockUser, 'validatePassword').mockResolvedValue(true);

    const result = await authService.validateUser(
      'johndoe@example.com',
      'password123',
    );
    expect(result).toEqual(mockUser);
    expect(usersService.findByEmail).toHaveBeenCalledWith(
      'johndoe@example.com',
    );
    expect(mockUser.validatePassword).toHaveBeenCalledWith('password123');
  });

  it('should return null if password is invalid', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(mockUser, 'validatePassword').mockResolvedValue(false);

    const result = await authService.validateUser(
      'johndoe@example.com',
      'wrongpassword',
    );
    expect(result).toBeNull();
    expect(usersService.findByEmail).toHaveBeenCalledWith(
      'johndoe@example.com',
    );
    expect(mockUser.validatePassword).toHaveBeenCalledWith('wrongpassword');
  });

  describe('AuthService - login', () => {
    it('should successfully login with valid credentials', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const loginDto = {
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const result = await authService.login(loginDto);

      expect(result).toEqual({
        access_token: 'valid_jwt_token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
        },
      });
      expect(authService.validateUser).toHaveBeenCalledWith(
        'johndoe@example.com',
        'password123',
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      const loginDto = {
        email: 'johndoe@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(authService.validateUser).toHaveBeenCalledWith(
        'johndoe@example.com',
        'wrongpassword',
      );
    });

    it('should handle unexpected errors during login', async () => {
      jest
        .spyOn(authService, 'validateUser')
        .mockRejectedValue(new Error('Unexpected error'));

      const loginDto = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(
        'Unexpected error',
      );

      expect(authService.validateUser).toHaveBeenCalledWith(
        'johndoe@example.com',
        'password123',
      );
    });
  });

  describe('AuthService - register', () => {
    it('should register a new user and return access token and user details', async () => {
      const mockRegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        position: 'Developer',
        salary: 75000,
        phone: '1234567890',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'USER',
      } as any;

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await authService.register(mockRegisterDto);

      expect(result).toEqual({
        access_token: 'valid_jwt_token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
        },
      });
      expect(usersService.create).toHaveBeenCalledWith(mockRegisterDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
    });

    it('should throw an error if registration fails', async () => {
      const mockRegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        position: 'Developer',
        salary: 75000,
        phone: '1234567890',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'USER',
      } as any;

      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new Error('Error creating user'));

      await expect(authService.register(mockRegisterDto)).rejects.toThrow(
        'Error creating user',
      );

      expect(usersService.create).toHaveBeenCalledWith(mockRegisterDto);
    });

    it('should return a JWT token if user creation succeeds', async () => {
      const mockRegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        position: 'Developer',
        salary: 75000,
        phone: '1234567890',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'USER',
      } as any;

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);
      mockJwtService.sign = jest.fn().mockReturnValue('returned_token');

      const result = await authService.register(mockRegisterDto);

      expect(result.access_token).toEqual('returned_token');
      expect(usersService.create).toHaveBeenCalledWith(mockRegisterDto);
    });
  });
});
