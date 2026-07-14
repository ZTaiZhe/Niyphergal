export type ApiError = { code: string; message: string };

export function json(data: unknown, status = 200, extraHeaders: HeadersInit = {}): Response {
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return new Response(JSON.stringify(data), { status, headers });
}

export function error(code: string, message: string, status: number): Response {
  return json({ ok: false, error: { code, message } satisfies ApiError }, status);
}

export function cors(response: Response, origin: string): Response {
  const result = new Response(response.body, response);
  result.headers.set("Access-Control-Allow-Origin", origin);
  result.headers.set("Access-Control-Allow-Credentials", "true");
  result.headers.set("Vary", "Origin");
  return result;
}
