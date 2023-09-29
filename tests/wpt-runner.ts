import {
  dirname,
  fromFileUrl,
  join,
  resolve,
  toFileUrl,
} from "https://deno.land/std@0.190.0/path/mod.ts";
import * as denoDom from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import * as DOM from "../mod.ts";
import { Statuses, TestReport, Tests, TestsStatus } from "./types.ts";
import { PubSub } from "./pubsub.ts";

for (const item of Object.keys(DOM)) {
  Object.defineProperty(self, item, {
    value: (DOM as Record<string, unknown>)[item],
  });
}

const parser = new denoDom.DOMParser();
const baseDir = import.meta.resolve("../wpt/");

export async function extractMetadata(
  path: URL,
  root: URL,
  cache: Map<string, string>,
): Promise<Metadata> {
  const source = await Deno.readTextFile(path);
  const document = parser.parseFromString(source, "text/html")!;
  const title = document.title;
  const metadata = { title, document: source, url: path };

  return metadata;
}

export interface Metadata {
  title: string;
  document: string;
  url: URL;
}

export function runTest(
  { document: doc, url }: Metadata,
): AsyncIterable<TestReport> {
  const pubsub = new PubSub<TestReport>();

  Object.defineProperty(globalThis, "pubsub", {
    value: pubsub,
    configurable: true,
  });

  const contents = doc.replace(
    new RegExp(
      `(<script src="?/resources/testharness.js"?></script>)`,
    ),
    `$1<script>add_result_callback((t) => {
      pubsub.publish(t._structured_clone)
    });</script>`,
  );

  new DOM.DOMParser().parseFromString(contents, "text/html", {
    baseURL: url,
    resolveURL: (src, baseURL) => {
      if (src.startsWith("/")) {
        const absolutePath = fromFileUrl(baseDir);
        const path = join(absolutePath, src);

        return toFileUrl(path);
      }

      const absolutePath = fromFileUrl(baseURL);
      const dirPath = dirname(absolutePath);

      return toFileUrl(resolve(dirPath, src));
    },
    fetch: Deno.readFileSync.bind(Deno),
  });

  window.add_completion_callback((_, testStatus, __, tests) => {
    clearTimeout(tests?.timeout_id ?? undefined);

    switch (testStatus.status) {
      case Statuses.Ok:
      case Statuses.Error:
        pubsub.unsubscribe();
        break;
      case Statuses.Timeout:
        pubsub.error(new Error("Timeout"));
        break;
      default: {
        pubsub.error(new Error("Precondition fail"));
      }
    }
  });

  dispatchEvent(new Event("load"));

  if (!document.scripts.length) {
    pubsub.unsubscribe();
  }

  return pubsub;
}

declare global {
  interface Window {
    add_completion_callback(
      fn: (_: unknown, status: TestsStatus, __: unknown, tests?: Tests) => void,
    ): void;
  }
}
