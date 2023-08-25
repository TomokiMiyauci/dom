import { SameObject } from "./extended_attribute.ts";
import {
  assert,
  assertSpyCalls,
  assertThrows,
  describe,
  it,
  spy,
} from "../_dev_deps.ts";

describe("SameObject", () => {
  it("should mutate to cached getter", () => {
    const fn = spy(() => {});
    const desc: PropertyDescriptor = { get: fn };
    SameObject(null, null, desc);

    assert(desc.get!() === desc.get!());
    assertSpyCalls(fn, 1);
  });

  it("should throw error if the descriptor does not exist getter", () => {
    assertThrows(() => SameObject(null, null, {}), Error);
  });
});
