import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryProvider } from './repository.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from './entities/films.enity';
import { Schedules } from './entities/schedules.entity';
import { DataSource } from 'typeorm';

export const repositoryMock = {
  getFilms: jest.fn(),
  getSchedule: jest.fn(),
  orderSeats: jest.fn(),
};

describe('RepositoryProvider', () => {
  let provider: RepositoryProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide:RepositoryProvider,
        useValue: repositoryMock
      }],
    }).compile();

    provider = module.get<RepositoryProvider>(RepositoryProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
