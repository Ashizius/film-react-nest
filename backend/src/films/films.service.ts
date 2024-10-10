import { Injectable, NotFoundException } from '@nestjs/common';
import { GetFilmsDTO, GetScheduleDTO } from './dto/films.dto';
import { Repository } from '../repository/repository';

@Injectable()
export class FilmsService {
  constructor(private readonly repository: Repository) {}
  async findAll(): Promise<GetFilmsDTO> {
    const [total, films] = await this.repository.filmsRepository.findAll();
    if (total === 0) {
      throw new NotFoundException('фильмов не найдено');
    }
    return {
      items: films,
      total: total,
    };
  }
  async findSchedule(id: string): Promise<GetScheduleDTO> {
    const film = await this.repository.filmsRepository.findOne(id);
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }
    return { total: film.schedule.length, items: film.schedule };
  }
}
