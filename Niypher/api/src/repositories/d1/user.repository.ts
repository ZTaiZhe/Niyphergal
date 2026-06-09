import type { User, UserRepository } from '../types';

interface D1UserRow {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  avatar: string;
}

export class D1UserRepository implements UserRepository {
  constructor(private db: D1Database) {}

  async getById(id: number): Promise<User | null> {
    const row = await this.db
      .prepare('SELECT id, email, name, avatar FROM users WHERE id = ?')
      .bind(id)
      .first<D1UserRow>();
    if (!row) return null;
    return { id: row.id, email: row.email, name: row.name, avatar: row.avatar };
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db
      .prepare('SELECT id, email, name, avatar FROM users WHERE email = ?')
      .bind(email)
      .first<D1UserRow>();
    if (!row) return null;
    return { id: row.id, email: row.email, name: row.name, avatar: row.avatar };
  }

  async create(data: { email: string; password_hash: string; name: string }): Promise<User> {
    const result = await this.db
      .prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)')
      .bind(data.email, data.password_hash, data.name)
      .run();
    const id = result.meta.last_row_id as number;
    return { id, email: data.email, name: data.name, avatar: '' };
  }
}
