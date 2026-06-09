import { CommentService } from '../services/comment.service';

export class CommentHandler {
  constructor(private commentService: CommentService) {}

  async getComments(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const gameId = url.searchParams.get('gameId');

    if (!gameId) {
      return Response.json(
        { success: false, error: 'gameId query parameter is required' },
        { status: 400 }
      );
    }

    const comments = await this.commentService.getByGameId(parseInt(gameId));
    return Response.json({ success: true, data: comments });
  }

  async createComment(request: Request): Promise<Response> {
    const body = (await request.json()) as {
      game_id?: number;
      user_id?: number;
      text?: string;
    };

    if (!body.game_id || !body.user_id || !body.text) {
      return Response.json(
        { success: false, error: 'game_id, user_id, and text are required' },
        { status: 400 }
      );
    }

    const comment = await this.commentService.create({
      game_id: body.game_id,
      user_id: body.user_id,
      text: body.text,
    });

    return Response.json({ success: true, data: comment }, { status: 201 });
  }
}
