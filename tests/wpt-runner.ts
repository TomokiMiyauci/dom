import {
  extname,
  join,
  toFileUrl,
} from "https://deno.land/std@0.190.0/path/mod.ts";
import { typeByExtension } from "https://deno.land/std@0.190.0/media_types/mod.ts";
import { DOMParser } from "../mod.ts";
import { TestReport } from "./types.ts";
import { PubSub } from "./pubsub.ts";

const injectCode = `add_result_callback((t) => {
  pubsub.publish(t._structured_clone)
});
add_completion_callback((_, testStatus, __, tests) => {
  clearTimeout(tests?.timeout_id ?? undefined);

  switch (testStatus.status) {
    case 0:
    case 1:
      pubsub.unsubscribe();
      break;
    case 2:
      pubsub.error(new Error("Timeout"));
      break;
    default: {
      pubsub.error(new Error("Precondition fail"));
    }
  }
});
`;

export function createHandler(
  { baseDir }: { baseDir: string },
): (request: Request) => Response {
  return (request) => {
    const url = new URL(request.url);
    const path = join(baseDir, url.pathname);
    const ext = extname(path);
    const fileURL = toFileUrl(path);
    const stream = Deno.readFileSync(fileURL);

    const maybeContentType = typeByExtension(ext);
    const headers = maybeContentType
      ? new Headers({ "content-type": maybeContentType })
      : undefined;
    const proxyResponse = new Response(stream, { headers });
    Object.defineProperty(proxyResponse, "url", {
      value: url,
    });

    return proxyResponse;
  };
}

const pattern = new RegExp(
  `(<script src=["']?/resources/testharness.js["']?></script>)`,
);
function injectScript(input: string): string {
  return input.replace(pattern, `$1<script>${injectCode}</script>`);
}

export class Runner {
  #pubsub: PubSub<TestReport> = new PubSub();
  constructor(
    public window: { DOMParser: typeof DOMParser } & Record<string, unknown>,
  ) {
  }

  async resolve(url: URL): Promise<string> {
    const response = await fetch(url);
    const content = await response.text();

    Object.defineProperty(globalThis, "pubsub", {
      value: this.#pubsub,
      configurable: true,
      writable: true,
    });
    const injectedContent = injectScript(content);

    return injectedContent;
  }

  async run(url: URL): Promise<AsyncIterable<TestReport>> {
    const content = await this.resolve(url);

    for (const item of Object.keys(this.window)) {
      Object.defineProperty(self, item, {
        value: (this.window as Record<string, unknown>)[item],
      });
    }

    const parser = new this.window.DOMParser();
    const document = parser.parseFromString(content, "text/html");

    if (!document.scripts.length) {
      this.#pubsub.unsubscribe();
    }

    return this.#pubsub;
  }
}
