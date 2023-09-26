import { walk } from "https://deno.land/std@0.190.0/fs/walk.ts";
import { escape } from "https://deno.land/std@0.190.0/regexp/mod.ts";
import { basename, toFileUrl } from "https://deno.land/std@0.190.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.190.0/jsonc/mod.ts";
import { extractMetadata, runTest } from "./wpt-runner.ts";
import pass from "./pass.json" assert { type: "json" };

const testList = await Deno.readTextFile(
  new URL(import.meta.resolve("./target.jsonc")),
).then(parse) as string[];

const passMap = new Map(
  Object.entries(pass.passes).map(([path, passes]) => {
    return [
      basename(path),
      new Set<string>(passes.map(({ name }) => name)),
    ] as const;
  }),
);

const wptRootURL = new URL(import.meta.resolve("../wpt/"));
const include = new RegExp(testList.map(escape).join("|"));
const entry = walk(wptRootURL, {
  includeDirs: false,
  match: [include],
});

const cache = new Map();

Deno.test("wpt", async (t) => {
  for await (const { path, name } of entry) {
    const url = toFileUrl(path);

    await t.step(url.href, async (t) => {
      const metadata = await extractMetadata(url, wptRootURL, cache);

      await t.step(metadata.title, async (t) => {
        const reports = runTest(metadata);
        // Workaround leading async ops. This is Deno's bug. @see https://github.com/denoland/deno/issues/15425
        await new Promise((resolve) => setTimeout(resolve, 0));

        for await (const report of reports) {
          const ignore = shouldBeIgnore(name, report.name);
          const markAsIgnoreButPass = ignore && !report.status;
          const definition: Deno.TestStepDefinition = {
            name: report.name,
            fn: markAsIgnoreButPass
              ? () => {
                throw new Error(`test case is passed but it mark as ignore`);
              }
              : () => {
                if (report.status) throw new Error(report.message);
              },
            ignore: !markAsIgnoreButPass && ignore,
          };

          await t.step(definition);
        }
      });
    });
  }
});

function shouldBeIgnore(title: string, description: string): boolean {
  return passMap.has(title) && passMap.get(title)!.has(description);
}
