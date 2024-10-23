import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { GetFilmsDTO, GetScheduleDTO } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}
  @Get()
  async findAll(): Promise<GetFilmsDTO> {
    const filmsDTO = await this.filmsService.findAll();
    return filmsDTO;
  }

  @Get(':id/schedule')
  async findSchedule(@Param('id') id: string): Promise<GetScheduleDTO> {
    const schedule = await this.filmsService.findSchedule(id);
    return schedule;
  }
}
