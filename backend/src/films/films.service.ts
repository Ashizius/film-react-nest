import { Injectable, NotFoundException } from '@nestjs/common';
import { GetFilmsDTO, GetScheduleDTO } from './dto/films.dto';
import { RepositoryProvider } from '../repository/repository.provider';

@Injectable()
export class FilmsService {
  constructor(private readonly repository: RepositoryProvider) {}
  async findAll(): Promise<GetFilmsDTO> {
    const [total, films] = await this.repository.getFilms();
    return {
      items: films,
      total: total,
    };
  }
  async findSchedule(id: string): Promise<GetScheduleDTO> {
    const film = await this.repository.getSchedule(id);
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }
    return { total: film.schedule.length, items: film.schedule };
  }
}
