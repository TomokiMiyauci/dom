/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { Comment as MyComment } from "./comment.ts";
import { assertType, IsExact } from "../_dev_deps.ts";

Deno.test("it should same constructor parameters", () => {
  assertType<
    IsExact<
      ConstructorParameters<typeof MyComment>,
      ConstructorParameters<typeof Text>
    >
  >(true);
});
