//TODO описать DTO для запросов к /films

import { IFilm, ISchedule } from "../../repository/films.repository";

export class GetScheduleDTO {
  items: ISchedule[];
  get total(): number {
    return this.items.length;
  }
}

export class GetFilmsDTO {
  items: IFilm[];
  get total(): number {
    return this.items.length;
  }
}
