import type { Message } from "./types.ts";
import * as modules from "../mod.ts";

const parser = new modules.DOMParser();

for (const item of Object.keys(modules)) {
  Object.defineProperty(self, item, { value: modules[item] });
}

addEventListener("message", (event: MessageEvent<Message>) => {
  const { source, scripts } = event.data;

  self.window = self;
  self.parent = self;

  const document = parser.parseFromString(source, "text/html")!;
  self.window.document = document;

  scripts.forEach(eval);

  postMessage({});
});
