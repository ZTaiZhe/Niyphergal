export interface Game {
  id: number;
  title: string;
  cover: string;
  tags: string[];
  intro: string;
  rating: number;
  size: string;
  date: string;
  language: string;
  platform: string;
  developer: string;
  versions: GameVersion[];
  media: GameMedia[];
}

export interface GameVersion {
  ver: string;
  date: string;
  size: string;
}

export interface GameMedia {
  type: string;
  url: string;
}

export interface CarouselSlide {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  action: { type: string; page: string; params: Record<string, any> } | null;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: number;
  game_id: number;
  user_id: number;
  text: string;
  created_at: string;
}

export interface GameRepository {
  getAll(params?: {
    sort?: string;
    order?: string;
    filter?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Game[]; total: number }>;
  getById(id: number): Promise<Game | null>;
  search(
    query: string,
    params?: {
      sort?: string;
      order?: string;
      filter?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ data: Game[]; total: number }>;
}

export interface CarouselRepository {
  getAll(): Promise<CarouselSlide[]>;
}

export interface UserRepository {
  getById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: { email: string; password_hash: string; name: string }): Promise<User>;
}

export interface CommentRepository {
  getByGameId(gameId: number): Promise<Comment[]>;
  create(data: { game_id: number; user_id: number; text: string }): Promise<Comment>;
}
