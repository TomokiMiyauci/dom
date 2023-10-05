export interface Handler {
  pattern: URLPattern;
  handle(request: Request): Response;
}
