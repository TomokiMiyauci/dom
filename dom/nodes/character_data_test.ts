/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { CharacterData as MyCharacterData } from "./character_data.ts";
import { assertType, IsExact } from "../../_dev_deps.ts";

Deno.test("it should same constructor parameters", () => {
  assertType<
    IsExact<
      ConstructorParameters<typeof MyCharacterData>,
      ConstructorParameters<typeof CharacterData>
    >
  >(true);
});
