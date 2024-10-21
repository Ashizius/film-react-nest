
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

export interface IFilm {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ISchedule[];
}

export interface ISchedule {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}
