import { walk } from "https://deno.land/std@0.190.0/fs/walk.ts";
import { escape } from "https://deno.land/std@0.190.0/regexp/mod.ts";
import { toFileUrl } from "https://deno.land/std@0.190.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.190.0/jsonc/mod.ts";
import { run } from "./wpt-runner.ts";
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
const include = new RegExp(testList.map(escape).join("|"));
const entry = walk(wptRootURL, {
  includeDirs: false,
  match: [include],
});

const cache = new Map();

Deno.test("wpt testing", async (t) => {
  for await (const { path } of entry) {
    const url = toFileUrl(path);

    await t.step({
      name: url.href,
      fn: async (t) => {
        const result = await run(url, wptRootURL, cache);

        // Workaround leading async ops. This is Deno's bug. @see https://github.com/denoland/deno/issues/15425
        await new Promise((resolve) => setTimeout(resolve, 0));

        await t.step(result[0]!.title, async (t) => {
          for (const test of result) {
            await t.step(test.description, () => {
              if (test.isSuccess) return;

              throw new Error(test.message, { cause: test.stack });
            });
          }
        });
      },
    });
  }
});
