import {
  dirname,
  join,
  toFileUrl,
} from "https://deno.land/std@0.190.0/path/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { insert } from "https://deno.land/x/upsert@1.2.0/mod.ts";
import * as DOM from "../mod.ts";
import type { TestReport } from "./types.ts";
import { PubSub } from "./pubsub.ts";

for (const item of Object.keys(DOM)) {
  Object.defineProperty(self, item, { value: DOM[item] });
}

const parser = new DOMParser();

export async function extractMetadata(
  path: URL,
  root: URL,
  cache: Map<string, string>,
): Promise<Metadata> {
  const source = await Deno.readTextFile(path);
  const document = parser.parseFromString(source, "text/html")!;
  const title = document.title;
  const elements = document.getElementsByTagName("script");
  const scripts = elements.map((node) => node.textContent);
  const deps = elements
    .filter((element) => element.hasAttribute("src"))
    .map((element) => element.getAttribute("src")!)
    .filter((v) => !v.endsWith("testharnessreport.js"))
    .map(
      (src) => {
        const url = src.startsWith("/")
          ? new URL("." + src, root)
          : toFileUrl(join(dirname(path.pathname), src));

        return url;
      },
    ).map((url) => {
      return insert(cache, url.pathname, Deno.readTextFileSync.bind(Deno));
    });

  const metadata = { scripts, deps, title, document: source };

  return metadata;
}

export interface Metadata {
  title: string;
  document: string;
  scripts: string[];
  deps: string[];
}

export function runTest(
  { deps, scripts, document: doc }: Metadata,
): AsyncIterable<TestReport> {
  const document = new DOM.DOMParser().parseFromString(doc, "text/html");

  if (!scripts.length) return { async *[Symbol.asyncIterator]() {} };

  Object.defineProperty(globalThis, "parent", {
    value: globalThis,
    configurable: true,
  });
  Object.defineProperty(globalThis, "document", {
    value: document,
    configurable: true,
  });

  const pubsub = new PubSub<TestReport>();
  const injectCode =
    `add_result_callback((t) => pubsub.publish(t._structured_clone));
add_completion_callback(() => pubsub.unsubscribe());`;
  const source = deps
    .concat(injectCode)
    .concat(scripts)
    .join("\n");

  eval(source);

  return pubsub;
}
