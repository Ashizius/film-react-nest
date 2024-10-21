import { Injectable } from '@nestjs/common';
import { RepositoryProvider } from '../repository/repository.provider';
import { IOrderResult, PostOrderDTO } from './dto/order.dto';


@Injectable()
export class OrderService {
  constructor(private readonly repository: RepositoryProvider) {}
  async order(postOrderDTO: PostOrderDTO): Promise<IOrderResult> {
    const tickets = await this.repository.orderSeats(
      postOrderDTO.tickets,
    );
    return { total: tickets.length, items: tickets };
  }
}
