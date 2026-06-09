import type { CarouselSlide, CarouselRepository } from '../types';

interface D1CarouselRow {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  action: string;
  sort_order: number;
}

export class D1CarouselRepository implements CarouselRepository {
  constructor(private db: D1Database) {}

  async getAll(): Promise<CarouselSlide[]> {
    const rows = await this.db
      .prepare('SELECT * FROM carousel_slides ORDER BY sort_order')
      .all<D1CarouselRow>();

    return rows.results.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      image: row.image,
      action: row.action ? JSON.parse(row.action) : null,
    }));
  }
}
