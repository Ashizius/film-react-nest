//TODO реализовать DTO для /orders

import { Type } from "class-transformer";
import { IsString, IsDate, IsNumber, IsArray, IsNotEmpty, ValidateNested, IsEmail, IsPhoneNumber } from "class-validator";


export interface ITicket {
  film: string;
  session: string;
  daytime: string;
  //day: string;
  //time: string;
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
  total:number,
  items: IBookResult[]
}

/*
{
  "email": "asdasd@sadfsdfsd.com",
  "phone": "+77777777777",
  "tickets": [
    {
      "film": "51b4bc85-646d-47fc-b988-3e7051a9fe9e",
      "session": "7f59de0d-62b2-412f-9e0b-bf6e971c44e5",
      "daytime": "2024-06-29T08:00:53.000Z",
      "day": "29 июня",
      "time": "11:00",
      "row": 3,
      "seat": 7,
      "price": 350
    }
  ]
}


{
    "error": "Сеанс не найден",
    "film": "5b82b2df-bcb6-42c4-9690-607283b90ade",
    "session": "1d366647-d5ae-4455-8fec-95db7d4466f0"
}



*/

export class TicketDTO implements ITicket {
  @IsString()
  @IsNotEmpty()
  film: string;
  @IsString()
  @IsNotEmpty()
  session: string;
  @IsString()
  daytime: string;
  /*@IsString()
  day: string;
  @IsString()
  time: string;*/
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


