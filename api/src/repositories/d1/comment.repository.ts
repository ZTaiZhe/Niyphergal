import type { Comment, CommentRepository } from '../types';

interface D1CommentRow {
  id: number;
  game_id: number;
  user_id: number;
  text: string;
  created_at: string;
}

export class D1CommentRepository implements CommentRepository {
  constructor(private db: D1Database) {}

  async getByGameId(gameId: number): Promise<Comment[]> {
    const rows = await this.db
      .prepare('SELECT * FROM comments WHERE game_id = ? ORDER BY created_at DESC')
      .bind(gameId)
      .all<D1CommentRow>();

    return rows.results.map((row) => ({
      id: row.id,
      game_id: row.game_id,
      user_id: row.user_id,
      text: row.text,
      created_at: row.created_at,
    }));
  }

  async create(data: { game_id: number; user_id: number; text: string }): Promise<Comment> {
    const result = await this.db
      .prepare('INSERT INTO comments (game_id, user_id, text) VALUES (?, ?, ?)')
      .bind(data.game_id, data.user_id, data.text)
      .run();
    const id = result.meta.last_row_id as number;
    return {
      id,
      game_id: data.game_id,
      user_id: data.user_id,
      text: data.text,
      created_at: new Date().toISOString(),
    };
  }
}
