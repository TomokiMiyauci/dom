/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { DocumentFragment as MyDocumentFragment } from "./document_fragment.ts";
import { assertType, IsExact } from "../../_dev_deps.ts";

Deno.test("it should same constructor parameters", () => {
  assertType<
    IsExact<
      ConstructorParameters<typeof MyDocumentFragment>,
      ConstructorParameters<typeof DocumentFragment>
    >
  >(true);
});
