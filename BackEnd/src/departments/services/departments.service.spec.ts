import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Department } from '../entities/department.entity';
import * as fs from 'fs';
import * as path from 'path';

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let repository: jest.Mocked<Repository<Department>>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: getRepositoryToken(Department),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    repository = module.get(getRepositoryToken(Department));
  });

  describe('findAll', () => {
    it('should return an array of departments', async () => {
      const departments: Department[] = [
        { id: 1, name: 'HR', code: 'HR1', cities: [] },
      ];
      repository.find.mockResolvedValue(departments);
      const result = await service.findAll();
      expect(result).toEqual(departments);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a department if found', async () => {
      const department = {
        id: 1,
        name: 'HR',
        code: 'HR1',
        cities: [],
      } as Department;
      repository.findOne.mockResolvedValue(department);

      const result = await service.findOne(1);
      expect(result).toEqual(department);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['cities'],
      });
    });

    it('should throw NotFoundException if department not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['cities'],
      });
    });
  });

  describe('loadInitialData', () => {
    it('should load initial data when no departments exist', async () => {
      repository.count.mockResolvedValue(0);
      repository.create.mockImplementation((data) => data as Department);
      repository.save.mockResolvedValue({} as Department);

      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(JSON.stringify([{ name: 'HR', code: 'HR1' }]));
      jest.spyOn(path, 'join').mockReturnValue('data/departments.json');

      await service.loadInitialData();

      expect(repository.count).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith({
        name: 'HR',
        code: 'HR1',
      });
      expect(repository.save).toHaveBeenCalled();
    });

    it('should not load data if departments already exist', async () => {
      repository.count.mockResolvedValue(1);

      await service.loadInitialData();

      expect(repository.count).toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw an error if loading fails', async () => {
      repository.count.mockResolvedValue(0);
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('Read error');
      });
      jest.spyOn(path, 'join').mockReturnValue('data/departments.json');

      await expect(service.loadInitialData()).rejects.toThrow(
        'Failed to load initial data',
      );
    });
  });
});
