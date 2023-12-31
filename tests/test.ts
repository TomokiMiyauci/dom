import { fromFileUrl } from "https://deno.land/std@0.190.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.190.0/jsonc/mod.ts";
import { createHandler, Runner } from "./wpt-runner.ts";
import pass from "./pass.json" assert { type: "json" };
import { Window } from "../mod.ts";

import "../_internals/html/elements/html_iframe_element_polyfill.ts";
import "../_internals/domparsing/extends/all.ts";
import "../_internals/html/loading_web_pages/events/event_target_internals.ts";
import "../_internals/html/extends/all.ts";
import "../_internals/wai_aria/extends/all.ts";
import "../_internals/web_animations/extends/all.ts";
import "../_internals/cssom_view/extends/all.ts";
import "../_internals/css/css_typed_om/extends/all.ts";
import "../_internals/pointerevents/extends/all.ts";
import "../_internals/pointerlock/extends/all.ts";
import "../_internals/fullscreen/extends/all.ts";
import "../_internals/css/css_shadow_parts/extends/all.ts";
import "../_internals/picture_in_picture/extends/all.ts";
import "../_internals/storage_access_api/extends/all.ts";
import "../_internals/selection/extends/all.ts";
import "../_internals/svg/extends/all.ts";
import "../_internals/css/css_font_loading/extends/all.ts";
import "../_internals/cssom/extends/all.ts";
import "../_internals/mathml/extends/all.ts";

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
Deno.serve({ hostname: "localhost", port: 8000 }, handler);

Deno.test("wpt", async (t) => {
  for (const { url, name } of targets) {
    await t.step({
      name: url.pathname,
      fn: async (t) => {
        const window = new Window(url);
        const runner = new Runner(window as any);

        const reports = await runner.run(url);

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
      },
    });
  }
});

function shouldBeIgnore(title: string, description: string): boolean {
  return passMap.has(title) && passMap.get(title)!.has(description);
}
