/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { Element as MyElement } from "./element.ts";
import { assertType, IsExact } from "../../_dev_deps.ts";

Deno.test("it should same constructor parameters", () => {
  assertType<
    IsExact<
      ConstructorParameters<typeof MyElement>,
      ConstructorParameters<typeof Element>
    >
  >(true);
});
