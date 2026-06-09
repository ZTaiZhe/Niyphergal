import type { CommentRepository } from '../repositories/types';

export class CommentService {
  constructor(private commentRepo: CommentRepository) {}

  async getByGameId(gameId: number) {
    return this.commentRepo.getByGameId(gameId);
  }

  async create(data: { game_id: number; user_id: number; text: string }) {
    return this.commentRepo.create(data);
  }
}
