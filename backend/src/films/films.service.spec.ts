import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { RepositoryProvider } from '../repository/repository.provider';
import { repositoryMock } from '../repository/repository.spec';

describe('FilmsService', () => {
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: RepositoryProvider,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
