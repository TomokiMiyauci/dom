import {
  extname,
  join,
  toFileUrl,
} from "https://deno.land/std@0.190.0/path/mod.ts";
import {
  mapEntries,
} from "https://deno.land/std@0.190.0/collections/map_entries.ts";
import { typeByExtension } from "https://deno.land/std@0.190.0/media_types/mod.ts";
import { TestReport } from "./types.ts";
import { PubSub } from "./pubsub.ts";
import { EncodingHandler } from "./handlers/encoding.ts";
import { RedirectHandler } from "./handlers/redirect.ts";
import { type Handler } from "./handlers/types.ts";
import { getPropertyDescriptors } from "../utils.ts";
import { $, internalSlots } from "../internal.ts";

const injectCode = `add_result_callback((t) => {
  pubsub.publish(t._structured_clone)
});
add_completion_callback((_, testStatus) => {
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
): (request: Request) => Promise<Response> {
  return async (request) => {
    const url = new URL(request.url);
    const path = join(baseDir, url.pathname);
    const ext = extname(path);

    if (ext === ".py") {
      return handlePython(request, [
        new EncodingHandler(),
        new RedirectHandler(),
      ]);
    }
    const fileURL = toFileUrl(path);
    const contents = await Deno.readTextFile(fileURL);
    const modified = fileURL.pathname.includes("testharness.js")
      ? contents.replace(`output:true,`, "output:false,")
      : contents;

    const maybeContentType = typeByExtension(ext);
    const headers = maybeContentType
      ? new Headers({ "content-type": maybeContentType })
      : undefined;
    const proxyResponse = new Response(modified, { headers });
    Object.defineProperty(proxyResponse, "url", {
      value: url,
    });

    return proxyResponse;
  };
}

export function handlePython(
  request: Request,
  handlers: Iterable<Handler>,
): Response {
  const url = new URL(request.url);

  for (const handler of handlers) {
    if (handler.pattern.test(url)) return handler.handle(request);
  }

  return new Response(null, { status: 404 });
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

    internalSlots.extends(globalThis, internalSlots.get(this.window));

    const windowDesc = getPropertyDescriptors(this.window);
    const desc = mapEntries(
      windowDesc,
      ([name, desc]) => [
        name,
        /^[A-Z]/.test(name) ? desc : bindDescriptor(this.window, desc),
      ],
    );

    const { location, window: _, self, ...rest } = desc;

    Object.defineProperties(globalThis, rest);
    // Avoid re-setting error. It maybe be Deno's bug.
    if (location) (globalThis as any)["location"] = this.window["location"];

    const parser = new this.window.DOMParser();
    const document = parser.parseFromString(content, "text/html");
    ($(this.window) as any).document = document;

    if (!document.scripts.length) {
      this.#pubsub.unsubscribe();
    }

    return this.#pubsub;
  }
}

function bindDescriptor(
  target: object,
  desc: PropertyDescriptor,
): PropertyDescriptor {
  if ("value" in desc) {
    const value: unknown = desc.value;

    return {
      ...desc,
      value: typeof value === "function" ? value.bind(target) : value,
    };
  }

  const { get, set, ...rest } = desc;

  return {
    ...rest,
    get: get && get.bind(target),
    set: set && set.bind(target),
  };
}
