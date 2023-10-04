import { type Handler } from "./types.ts";

/** The JavaScript version of HTTP handler
 * @see https://github.com/web-platform-tests/wpt/blob/1af7ffeb926a3644c33bcbf7ab0a1bb6c2f0a824/dom/nodes/encoding.py#L4
 */

export function handleRequest(request: Request): Response {
  const url = new URL(request.url);
  // TODO escape HTML
  const label = url.searchParams.get("label") ?? "";

  return new Response(`<!doctype html><meta charset="${label}">`, {
    headers: new Headers({ "content-type": "text/html" }),
  });
}

export class EncodingHandler implements Handler {
  pattern = new URLPattern({
    pathname: "/dom/nodes/encoding.py",
    search: "label=*",
  });

  handle = handleRequest;
}
