/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { CDATASection as MyCDATASection } from "./cdata_section.ts";
import { assertType, IsExact } from "../_dev_deps.ts";

Deno.test("it should same constructor parameters", () => {
  assertType<
    IsExact<
      ConstructorParameters<typeof MyCDATASection>,
      ConstructorParameters<typeof CDATASection>
    >
  >(true);
});
