import { GameService } from '../services/game.service';

export class GameHandler {
  constructor(private gameService: GameService) {}

  async listGames(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const params = {
      sort: url.searchParams.get('sort') ?? undefined,
      order: url.searchParams.get('order') ?? undefined,
      filter: url.searchParams.get('filter') ?? undefined,
      page: url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined,
      limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined,
    };

    const result = await this.gameService.listGames(params);
    return Response.json({ success: true, ...result });
  }

  async getGame(request: Request, id: number): Promise<Response> {
    const game = await this.gameService.getGame(id);
    if (!game) {
      return Response.json({ success: false, error: 'Game not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: game });
  }

  async searchGames(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') ?? '';
    if (!query) {
      return Response.json({ success: false, error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const params = {
      sort: url.searchParams.get('sort') ?? undefined,
      order: url.searchParams.get('order') ?? undefined,
      filter: url.searchParams.get('filter') ?? undefined,
      page: url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined,
      limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined,
    };

    const result = await this.gameService.searchGames(query, params);
    return Response.json({ success: true, ...result });
  }

  async getCarousel(): Promise<Response> {
    const slides = await this.gameService.getCarousel();
    return Response.json({ success: true, data: slides });
  }
}
