import { Controller, Get, Inject, LoggerService, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { GetFilmsDTO, GetScheduleDTO } from './dto/films.dto';
import { Providers } from '../configuration';

@Controller('films')
export class FilmsController {
  constructor(
    private readonly filmsService: FilmsService,
    @Inject(Providers.logger) private logger: LoggerService,
  ) {}
  @Get()
  async findAll(): Promise<GetFilmsDTO> {
    const filmsDTO = await this.filmsService.findAll();
    return filmsDTO;
  }

  @Get(':id/schedule')
  async findSchedule(@Param('id') id: string): Promise<GetScheduleDTO> {
    const schedule = await this.filmsService.findSchedule(id);
    this.logger.log('accessedId', id);
    return schedule;
  }
}
