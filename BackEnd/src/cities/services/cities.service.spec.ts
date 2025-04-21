import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { City } from '../entities/city.entity';
import { Department } from '../../departments/entities/department.entity';
import * as fs from 'fs';

describe('CitiesService', () => {
  let service: CitiesService;
  let citiesRepository: Repository<City>;
  let departmentsRepository: Repository<Department>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: getRepositoryToken(City),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Department),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    citiesRepository = module.get<Repository<City>>(getRepositoryToken(City));
    departmentsRepository = module.get<Repository<Department>>(
      getRepositoryToken(Department),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(citiesRepository).toBeDefined();
    expect(departmentsRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cities', async () => {
      const mockCities = [
        { id: 1, name: 'City1', department: {} as Department },
      ];
      jest
        .spyOn(citiesRepository, 'find')
        .mockResolvedValue(mockCities as City[]);

      const result = await service.findAll();
      expect(result).toEqual(mockCities);
      expect(citiesRepository.find).toHaveBeenCalledWith({
        relations: ['department'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a city when found', async () => {
      const mockCity = { id: 1, name: 'City1', department: {} as Department };
      jest
        .spyOn(citiesRepository, 'findOne')
        .mockResolvedValue(mockCity as City);

      const result = await service.findOne(1);
      expect(result).toEqual(mockCity);
      expect(citiesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['department'],
      });
    });

    it('should throw NotFoundException when a city is not found', async () => {
      jest.spyOn(citiesRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(citiesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['department'],
      });
    });
  });

  describe('findByDepartment', () => {
    it('should return cities belonging to a specific department', async () => {
      const mockCities = [
        { id: 1, name: 'City1', department: {} as Department },
      ];
      jest
        .spyOn(citiesRepository, 'find')
        .mockResolvedValue(mockCities as City[]);

      const result = await service.findByDepartment(1);
      expect(result).toEqual(mockCities);
      expect(citiesRepository.find).toHaveBeenCalledWith({
        where: { department: { id: 1 } },
        relations: ['department'],
      });
    });
  });

  describe('loadInitialData', () => {
    it('should load initial data when repository is empty', async () => {
      jest.spyOn(citiesRepository, 'count').mockResolvedValue(0);
      jest
        .spyOn(departmentsRepository, 'findOne')
        .mockResolvedValue({ id: 1 } as Department);
      jest
        .spyOn(citiesRepository, 'create')
        .mockImplementation((entity) => entity as City);
      jest.spyOn(citiesRepository, 'save').mockResolvedValue({} as City);
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(
          JSON.stringify([
            { name: 'City1', code: 'C001', departmentCode: 'D001' },
          ]),
        );

      await expect(service.loadInitialData()).resolves.not.toThrow();
      expect(citiesRepository.save).toHaveBeenCalled();
      expect(departmentsRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'D001' },
      });
    });

    it('should not load data if repository is not empty', async () => {
      jest.spyOn(citiesRepository, 'count').mockResolvedValue(1);
      jest.spyOn(citiesRepository, 'save');
      await expect(service.loadInitialData()).resolves.not.toThrow();
      expect(citiesRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error if loading data fails', async () => {
      jest.spyOn(citiesRepository, 'count').mockResolvedValue(0);
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('File error');
      });

      await expect(service.loadInitialData()).rejects.toThrow(
        'Error loading initial data for cities',
      );
    });
  });
});
