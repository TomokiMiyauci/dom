import { fromFileUrl } from "https://deno.land/std@0.190.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.190.0/jsonc/mod.ts";
import { createHandler, Runner } from "./wpt-runner.ts";
import pass from "./pass.json" assert { type: "json" };
import * as DOM from "../mod.ts";

const wptRootURL = new URL(import.meta.resolve("../wpt/"));
const wptRoot = fromFileUrl(wptRootURL);
const targetContent = await Deno.readTextFile(
  fromFileUrl(import.meta.resolve("./target.jsonc")),
);
const baseURL = new URL("http://localhost:8000");
const testList = parse(targetContent) as string[];
const targets = testList.map((name) => ({
  name,
  url: new URL(name, baseURL),
}));

const passMap = new Map(
  Object.entries(pass.passes).map(([path, passes]) => {
    return [path, new Set<string>(passes.map(({ name }) => name))] as const;
  }),
);
const handler = createHandler({ baseDir: wptRoot });
const server = Deno.serve({ hostname: "localhost", port: 8000 }, handler);
server.unref();

Deno.test("wpt", async (t) => {
  for (const { url, name } of targets) {
    await t.step(url.pathname, async (t) => {
      const runner = new Runner({
        ...DOM,
        location: {
          href: url.href,
          toString() {
            return url.href;
          },
        },
      });

      const reports = await runner.run(url);
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
  }
});

function shouldBeIgnore(title: string, description: string): boolean {
  return passMap.has(title) && passMap.get(title)!.has(description);
}
