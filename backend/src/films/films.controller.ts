import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { GetFilmsDTO, GetScheduleDTO } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}
  @Get() // этот метод будет вызван для запроса GET /films
  async findAll(): Promise<GetFilmsDTO> {
    const filmsDTO = await this.filmsService.findAll();
    return filmsDTO;
  }

  @Get(':id/schedule') // этот метод будет вызван для запроса GET /films
  async findSchedule(@Param('id') id: string): Promise<GetScheduleDTO> {
    const schedule = await this.filmsService.findSchedule(id);
    return schedule;
  }
}
