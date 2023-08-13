import {
  dirname,
  join,
  toFileUrl,
} from "https://deno.land/std@0.190.0/path/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { insert } from "https://deno.land/x/upsert@1.2.0/mod.ts";
import type { Message } from "./types.ts";

const parser = new DOMParser();
const url = new URL(import.meta.resolve("./worker.ts"));

export async function run(
  path: URL,
  root: URL,
  cache: Map<string, string>,
): Promise<void> {
  const source = await Deno.readTextFile(path);
  const document = parser.parseFromString(source, "text/html")!;
  const elements = document.getElementsByTagName("script");
  const scripts = elements.map(
    (element) => {
      const src = element.getAttribute("src");

      if (src) {
        const url = src.startsWith("/")
          ? new URL("." + src, root)
          : toFileUrl(join(dirname(path.pathname), src));

        return insert(cache, url.pathname, Deno.readTextFileSync.bind(Deno));
      }

      return element.textContent;
    },
  );

  const worker = new Worker(url, { type: "module" });
  const message: Message = { source, scripts };

  worker.postMessage(message);

  return new Promise<void>((resolve, reject) => {
    worker.addEventListener("error", (event) => {
      event.preventDefault();
      worker.terminate();
      reject(event.message);
    });

    worker.addEventListener("message", () => {
      worker.terminate();
      resolve();
    });
  });
}
