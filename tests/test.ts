import { walk } from "https://deno.land/std@0.190.0/fs/walk.ts";
import { escape } from "https://deno.land/std@0.190.0/regexp/mod.ts";
import { basename, toFileUrl } from "https://deno.land/std@0.190.0/path/mod.ts";
import { run } from "./wpt-runner.ts";

const wptRootURL = new URL(import.meta.resolve("../wpt/"));
const patterns = [
  "ChildNode-",
  "Document-",
  "Comment-",
  "Element-",
  "getElementsByClassName-",
  "Node-",
  "ParentNode-",
  "Text-",
];

const include = new RegExp(
  patterns.map((pattern) => "/dom/nodes/" + pattern).map(escape).join("|"),
);

const entry = walk(wptRootURL, {
  exts: [".html"],
  includeDirs: false,
  match: [include],
});

const cache = new Map();

for await (const { path } of entry) {
  const url = toFileUrl(path);

  const description = basename(url.pathname);

  Deno.test(description, () => run(url, wptRootURL, cache));
}
