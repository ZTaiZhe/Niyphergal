import { AuthService } from '../services/auth.service';

export class AuthHandler {
  constructor(private authService: AuthService) {}

  async register(request: Request): Promise<Response> {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!body.email || !body.password || !body.name) {
      return Response.json(
        { success: false, error: 'email, password, and name are required' },
        { status: 400 }
      );
    }

    const result = await this.authService.register(body.email, body.password, body.name);
    return Response.json({ success: true, data: result }, { status: 201 });
  }

  async login(request: Request): Promise<Response> {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return Response.json(
        { success: false, error: 'email and password are required' },
        { status: 400 }
      );
    }

    const result = await this.authService.login(body.email, body.password);
    return Response.json({ success: true, data: result });
  }

  async refresh(request: Request): Promise<Response> {
    const body = (await request.json()) as { refresh_token?: string };

    if (!body.refresh_token) {
      return Response.json(
        { success: false, error: 'refresh_token is required' },
        { status: 400 }
      );
    }

    const result = await this.authService.refresh(body.refresh_token);
    return Response.json({ success: true, data: result });
  }
}
