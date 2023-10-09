/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { ShadowRoot as MyShadowRoot } from "./shadow_root.ts";
import { assertType, IsExact } from "../../_dev_deps.ts";

Deno.test("it should same constructor parameters", () => {
  assertType<
    IsExact<
      ConstructorParameters<typeof MyShadowRoot>,
      ConstructorParameters<typeof ShadowRoot>
    >
  >(true);
});
