import { List } from "./list.ts";
import { assertEquals, describe, it } from "../../../_dev_deps.ts";
import { isOdd } from "https://deno.land/x/isx@1.5.0/number/is_odd.ts";

describe("List", () => {
  it("should replace items if match condition", () => {
    const list = new List([0, 1, 2, 3, 4]);

    list.replace(1, isOdd);

    assertEquals([...list], [0, 1, 2, 1, 4]);
  });

  it("should should replace all if match condition is true", () => {
    const list = new List([0, 1, 2, 3, 4]);

    list.replace(1, () => true);

    assertEquals([...list], [1, 1, 1, 1, 1]);
  });

  it("should should do nothing if match condition is false", () => {
    const list = new List([0, 1, 2, 3, 4]);

    list.replace(1, () => false);

    assertEquals([...list], [0, 1, 2, 3, 4]);
  });
});
