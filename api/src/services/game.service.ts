import type { GameRepository, CarouselRepository } from '../repositories/types';

export class GameService {
  constructor(
    private gameRepo: GameRepository,
    private carouselRepo: CarouselRepository
  ) {}

  async listGames(params?: {
    sort?: string;
    order?: string;
    filter?: string;
    page?: number;
    limit?: number;
  }) {
    return this.gameRepo.getAll(params);
  }

  async getGame(id: number) {
    return this.gameRepo.getById(id);
  }

  async searchGames(
    query: string,
    params?: {
      sort?: string;
      order?: string;
      filter?: string;
      page?: number;
      limit?: number;
    }
  ) {
    return this.gameRepo.search(query, params);
  }

  async getCarousel() {
    return this.carouselRepo.getAll();
  }
}
