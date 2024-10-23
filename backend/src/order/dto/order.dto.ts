import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export interface ITicket {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export interface IOrder {
  email: string;
  phone: string;
  tickets: ITicket[];
}

export interface IBookResult extends ITicket {
  id: string;
}

export interface IOrderResult {
  total: number;
  items: IBookResult[];
}

export class TicketDTO implements ITicket {
  @IsString()
  @IsNotEmpty()
  film: string;
  @IsString()
  @IsNotEmpty()
  session: string;
  @IsString()
  daytime: string;
  @IsNumber()
  row: number;
  @IsNumber()
  seat: number;
  @IsNumber()
  price: number;
}

export class PostOrderDTO implements IOrder {
  @IsEmail()
  email: string;
  @IsPhoneNumber()
  phone: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDTO)
  tickets: TicketDTO[];
}
