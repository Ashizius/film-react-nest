import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { RepositoryProvider } from '../repository/repository.provider';
import { repositoryMock } from '../repository/repository.spec';
import { Providers } from '../configuration';

export const loggerMock = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        FilmsService,
        {
          provide: RepositoryProvider,
          useValue: repositoryMock,
        },
        { provide: Providers.logger, useValue: loggerMock },
      ],
    })
      .overrideProvider(FilmsService)
      .useValue({
        findAll: jest.fn(),
        findSchedule: jest.fn(),
      })
      .compile();
    service = module.get<FilmsService>(FilmsService);
    controller = module.get<FilmsController>(FilmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('.findSchedule() should call findSchedule method of the service', () => {
    const id = 's-o-m-e-I-d-';

    controller.findSchedule(id);

    expect(service.findSchedule).toHaveBeenCalledWith(id);
  });

  it('.findAll() should call findAll method of the service', () => {
    controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
  });
});
