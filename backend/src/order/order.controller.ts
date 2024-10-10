import { Body, Controller, Post } from '@nestjs/common';
import { IOrderResult, PostOrderDTO } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async createOrder(@Body() postOrderDTO: PostOrderDTO): Promise<IOrderResult> {
    const result = await this.orderService.order(postOrderDTO);
    return result;
  }
}
