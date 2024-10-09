import { Injectable } from '@nestjs/common';
import { Repository } from '../repository/repository';
import { IOrderResult, PostOrderDTO } from './dto/order.dto';
import { faker } from '@faker-js/faker';

@Injectable()
export class OrderService {
  constructor(private readonly repository: Repository) {}
  async order (postOrderDTO: PostOrderDTO): Promise<IOrderResult> /*IOrderResponse*/ {
    const documents = await this.repository.filmsRepository.takeSeats(postOrderDTO.tickets)
    const tickets = documents.map(document=>{
      const session= document.schedule[0];
      return {
        film:document.id,
        session: session.id,
        daytime: session.daytime,
        row: Number(document.takenRow),
        seat: Number(document.takenSeat),
        price: session.price,
        id: faker.string.uuid()
      }
    })
    return {total:tickets.length,items:tickets}
  }
}
