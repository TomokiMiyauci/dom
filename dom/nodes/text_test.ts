/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { Text as MyText } from "./text.ts";
import { assertType, IsExact } from "../../_dev_deps.ts";

Deno.test("it should same constructor parameters", () => {
  assertType<
    IsExact<
      ConstructorParameters<typeof MyText>,
      ConstructorParameters<typeof Text>
    >
  >(true);
});
