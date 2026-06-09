import type { UserRepository } from '../repositories/types';

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async getProfile(userId: number) {
    return this.userRepo.getById(userId);
  }
}
