import { walk } from "https://deno.land/std@0.190.0/fs/walk.ts";
import { escape } from "https://deno.land/std@0.190.0/regexp/mod.ts";
import { toFileUrl } from "https://deno.land/std@0.190.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.190.0/jsonc/mod.ts";
import { run } from "./wpt-runner.ts";
import { describe, it } from "../_dev_deps.ts";
import type { TestReport } from "./types.ts";
import pass from "./pass.json" assert { type: "json" };

const testList = await Deno.readTextFile(
  new URL(import.meta.resolve("./target.jsonc")),
).then(parse) as string[];

const passMap = new Map(
  Object.entries(pass.passes).map(([title, subtitle]) =>
    [title, new Set<string>(subtitle)] as const
  ),
);

const wptRootURL = new URL(import.meta.resolve("../wpt/"));

const include = new RegExp(
  testList.map((pattern) => "/dom/nodes/" + pattern).map(escape).join(
    "|",
  ),
);

const entry = walk(wptRootURL, {
  exts: [".html"],
  includeDirs: false,
  match: [include],
});

const cache = new Map();

for await (const { path } of entry) {
  const url = toFileUrl(path);

  const result = await run(url, wptRootURL, cache).catch((e: string) => {
    const test: TestReport = {
      title: "unknown",
      description: "unknown",
      isSuccess: false,
      message: e,
      stack: "",
    };

    return [test];
  });

  describe(url.href, () => {
    for (const test of result) {
      if (test.isSuccess) {
        it(test.description, () => {});
        continue;
      }

      if (
        (passMap.has(test.title) &&
          passMap.get(test.title)!.has(test.description))
      ) {
        it(test.description, { ignore: true }, () => {});
        continue;
      }

      it(test.description, () => {
        throw new Error(test.message || test.stack);
      });
    }
  });
}
