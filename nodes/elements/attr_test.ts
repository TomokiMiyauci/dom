/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { Attr as MyAttr } from "./attr.ts";
import { assertType, IsExact } from "../../_dev_deps.ts";

Deno.test("it should same constructor parameters", () => {
  assertType<
    IsExact<
      ConstructorParameters<typeof MyAttr>,
      ConstructorParameters<typeof Attr>
    >
  >(true);
});
