import type { Game, GameRepository } from '../types';

interface D1GameRow {
  id: number;
  title: string;
  cover: string;
  tags: string;
  intro: string;
  rating: number;
  size: string;
  date: string;
  language: string;
  platform: string;
  developer: string;
}

interface D1GameVersionRow {
  ver: string;
  date: string;
  size: string;
}

interface D1GameMediaRow {
  type: string;
  url: string;
  sort_order: number;
}

function mapRowToGame(
  row: D1GameRow,
  versions: D1GameVersionRow[],
  media: D1GameMediaRow[]
): Game {
  return {
    id: row.id,
    title: row.title,
    cover: row.cover,
    tags: JSON.parse(row.tags || '[]'),
    intro: row.intro,
    rating: row.rating,
    size: row.size,
    date: row.date,
    language: row.language,
    platform: row.platform,
    developer: row.developer,
    versions,
    media: media.map((m) => ({ type: m.type, url: m.url })),
  };
}

export class D1GameRepository implements GameRepository {
  constructor(private db: D1Database) {}

  async getAll(params?: {
    sort?: string;
    order?: string;
    filter?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Game[]; total: number }> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const whereParams: unknown[] = [];
    if (params?.filter) {
      whereClause = ' WHERE tags LIKE ?';
      whereParams.push(`%${params.filter}%`);
    }

    const allowedSorts = ['title', 'rating', 'date', 'id'];
    const sortCol = allowedSorts.includes(params?.sort ?? '') ? params!.sort : 'id';
    const order = params?.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countResult = await this.db
      .prepare(`SELECT COUNT(*) as total FROM games${whereClause}`)
      .bind(...whereParams)
      .first<{ total: number }>();

    const rows = await this.db
      .prepare(
        `SELECT * FROM games${whereClause} ORDER BY ${sortCol} ${order} LIMIT ? OFFSET ?`
      )
      .bind(...whereParams, limit, offset)
      .all<D1GameRow>();

    const games: Game[] = [];
    for (const row of rows.results) {
      const [versions, media] = await Promise.all([
        this.db.prepare('SELECT ver, date, size FROM game_versions WHERE game_id = ?').bind(row.id).all<D1GameVersionRow>(),
        this.db.prepare('SELECT type, url, sort_order FROM game_media WHERE game_id = ? ORDER BY sort_order').bind(row.id).all<D1GameMediaRow>(),
      ]);
      games.push(mapRowToGame(row, versions.results, media.results));
    }

    return { data: games, total: countResult?.total ?? 0 };
  }

  async getById(id: number): Promise<Game | null> {
    const row = await this.db
      .prepare('SELECT * FROM games WHERE id = ?')
      .bind(id)
      .first<D1GameRow>();
    if (!row) return null;

    const [versions, media] = await Promise.all([
      this.db.prepare('SELECT ver, date, size FROM game_versions WHERE game_id = ?').bind(id).all<D1GameVersionRow>(),
      this.db.prepare('SELECT type, url, sort_order FROM game_media WHERE game_id = ? ORDER BY sort_order').bind(id).all<D1GameMediaRow>(),
    ]);

    return mapRowToGame(row, versions.results, media.results);
  }

  async search(
    query: string,
    params?: {
      sort?: string;
      order?: string;
      filter?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ data: Game[]; total: number }> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const offset = (page - 1) * limit;
    const likeQuery = `%${query}%`;

    let filterClause = '';
    const filterParams: unknown[] = [];
    if (params?.filter) {
      filterClause = ' AND tags LIKE ?';
      filterParams.push(`%${params.filter}%`);
    }

    const allowedSorts = ['title', 'rating', 'date', 'id'];
    const sortCol = allowedSorts.includes(params?.sort ?? '') ? params!.sort : 'id';
    const order = params?.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countResult = await this.db
      .prepare(
        `SELECT COUNT(*) as total FROM games WHERE (title LIKE ? OR tags LIKE ?)${filterClause}`
      )
      .bind(likeQuery, likeQuery, ...filterParams)
      .first<{ total: number }>();

    const rows = await this.db
      .prepare(
        `SELECT * FROM games WHERE (title LIKE ? OR tags LIKE ?)${filterClause} ORDER BY ${sortCol} ${order} LIMIT ? OFFSET ?`
      )
      .bind(likeQuery, likeQuery, ...filterParams, limit, offset)
      .all<D1GameRow>();

    const games: Game[] = [];
    for (const row of rows.results) {
      const [versions, media] = await Promise.all([
        this.db.prepare('SELECT ver, date, size FROM game_versions WHERE game_id = ?').bind(row.id).all<D1GameVersionRow>(),
        this.db.prepare('SELECT type, url, sort_order FROM game_media WHERE game_id = ? ORDER BY sort_order').bind(row.id).all<D1GameMediaRow>(),
      ]);
      games.push(mapRowToGame(row, versions.results, media.results));
    }

    return { data: games, total: countResult?.total ?? 0 };
  }
}
