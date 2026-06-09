import { D1GameRepository } from './repositories/d1/game.repository';
import { D1CarouselRepository } from './repositories/d1/carousel.repository';
import { D1UserRepository } from './repositories/d1/user.repository';
import { D1CommentRepository } from './repositories/d1/comment.repository';

import { GameService } from './services/game.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { CommentService } from './services/comment.service';

import { GameHandler } from './handlers/game.handler';
import { AuthHandler } from './handlers/auth.handler';
import { UserHandler } from './handlers/user.handler';
import { CommentHandler } from './handlers/comment.handler';

export interface Env {
  DB: D1Database;
}

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders())) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

function matchRoute(path: string, pattern: string): Record<string, string> | null {
  const pathParts = path.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  if (pathParts.length !== patternParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Initialize repositories
    const gameRepo = new D1GameRepository(env.DB);
    const carouselRepo = new D1CarouselRepository(env.DB);
    const userRepo = new D1UserRepository(env.DB);
    const commentRepo = new D1CommentRepository(env.DB);

    // Initialize services
    const gameService = new GameService(gameRepo, carouselRepo);
    const authService = new AuthService();
    const userService = new UserService(userRepo);
    const commentService = new CommentService(commentRepo);

    // Initialize handlers
    const gameHandler = new GameHandler(gameService);
    const authHandler = new AuthHandler(authService);
    const userHandler = new UserHandler(userService);
    const commentHandler = new CommentHandler(commentService);

    try {
      // Health check
      if (path === '/' || path === '') {
        return withCors(jsonResponse({ success: true, message: 'NiypherGal API' }));
      }

      // Game routes
      if (path === '/games' && request.method === 'GET') {
        return withCors(await gameHandler.listGames(request));
      }

      if (path === '/carousel' && request.method === 'GET') {
        return withCors(await gameHandler.getCarousel());
      }

      if (path === '/search' && request.method === 'GET') {
        return withCors(await gameHandler.searchGames(request));
      }

      // Game detail: /games/:id
      const gameDetailMatch = matchRoute(path, '/games/:id');
      if (gameDetailMatch && request.method === 'GET') {
        const id = parseInt(gameDetailMatch.id);
        if (isNaN(id)) {
          return withCors(jsonResponse({ success: false, error: 'Invalid game id' }, 400));
        }
        return withCors(await gameHandler.getGame(request, id));
      }

      // Auth routes
      if (path === '/auth/register' && request.method === 'POST') {
        return withCors(await authHandler.register(request));
      }

      if (path === '/auth/login' && request.method === 'POST') {
        return withCors(await authHandler.login(request));
      }

      if (path === '/auth/refresh' && request.method === 'POST') {
        return withCors(await authHandler.refresh(request));
      }

      // User routes
      if (path === '/user/profile' && request.method === 'GET') {
        return withCors(await userHandler.getProfile(request));
      }

      // Comment routes
      if (path === '/comments' && request.method === 'GET') {
        return withCors(await commentHandler.getComments(request));
      }

      if (path === '/comments' && request.method === 'POST') {
        return withCors(await commentHandler.createComment(request));
      }

      return withCors(jsonResponse({ success: false, error: 'Not found' }, 404));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      return withCors(jsonResponse({ success: false, error: message }, 500));
    }
  },
};
