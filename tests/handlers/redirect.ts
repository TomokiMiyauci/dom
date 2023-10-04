import type { Handler } from "./types.ts";

export class RedirectHandler implements Handler {
  pattern: URLPattern = new URLPattern({
    pathname: "/common/redirect.py",
    search: "location=*",
  });

  handle(request: Request): Response {
    const url = new URL(request.url);
    const location = url.searchParams.get("location")!;
    const to = new URL(location, url);

    return Response.redirect(to, 302);
  }
}
