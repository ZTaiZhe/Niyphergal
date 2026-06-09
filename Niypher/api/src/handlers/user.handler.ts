import { UserService } from '../services/user.service';

export class UserHandler {
  constructor(private userService: UserService) {}

  async getProfile(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const userId = parseInt(url.searchParams.get('id') ?? '1');

    const user = await this.userService.getProfile(userId);
    if (!user) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: user });
  }
}
