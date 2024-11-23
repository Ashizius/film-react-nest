import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { RepositoryProvider } from '../repository/repository.provider';
import { repositoryMock } from '../repository/repository.spec';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: RepositoryProvider,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
