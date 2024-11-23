import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RepositoryProvider } from '../repository/repository.provider';
import { repositoryMock } from '../repository/repository.spec';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        {
          provide: RepositoryProvider,
          useValue: repositoryMock,
        },
      ],
    })
      .overrideProvider(OrderService)
      .useValue({
        order: jest.fn(),
      })
      .compile();
    service = module.get<OrderService>(OrderService);
    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('.createOrder() should call order method of the service', () => {
    const order = {
      email: 'email@email.com',
      phone: '+7-900-123-45-67',
      tickets: [],
    };
    controller.createOrder(order);

    expect(service.order).toHaveBeenCalledWith(order);
  });
});
