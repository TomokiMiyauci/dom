/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { ProcessingInstruction as MyProcessingInstruction } from "./processing_instruction.ts";
import { assertType, IsExact } from "../../_dev_deps.ts";

Deno.test("it should same constructor parameters", () => {
  assertType<
    IsExact<
      ConstructorParameters<typeof MyProcessingInstruction>,
      ConstructorParameters<typeof ProcessingInstruction>
    >
  >(true);
});
