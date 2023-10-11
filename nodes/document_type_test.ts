/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { DocumentType as MyDocumentType } from "./document_type.ts";
import { assertType, IsExact } from "../_dev_deps.ts";

Deno.test("it should same constructor parameters", () => {
  assertType<
    IsExact<
      ConstructorParameters<typeof MyDocumentType>,
      ConstructorParameters<typeof DocumentType>
    >
  >(true);
});
