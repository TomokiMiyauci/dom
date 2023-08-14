import { OrderedSet } from "./set.ts";
import { assertEquals, describe, it } from "../_dev_deps.ts";

describe("OrderedSet", () => {
  it("should not add item if the item exists", () => {
    const set = new OrderedSet([0]);

    set.append(0);

    assertEquals([...set], [0]);
  });

  it("should add item if the item does not exist", () => {
    const set = new OrderedSet([0]);

    set.append(1);

    assertEquals([...set], [0, 1]);
  });

  it("should not add item to beginning if the item exists", () => {
    const set = new OrderedSet([0]);

    set.prepend(0);

    assertEquals([...set], [0]);
  });

  it("should add item if the item does not exist", () => {
    const set = new OrderedSet([0]);

    set.prepend(1);

    assertEquals([...set], [1, 0]);
  });

  it("should unique given items", () => {
    const set = new OrderedSet([0, 1, 0, 2, 1, 0, 2]);

    assertEquals([...set], [0, 1, 2]);
  });

  it("should replace", () => {
    const table: [Iterable<number>, number, number, Iterable<number>][] = [
      [[], 0, 0, []],
      [[], 0, 1, []],
      [[0], 0, 1, [1]],
      [[0, 0], 0, 1, [1]],
      [[0, 1], 0, 1, [1]],
      [[0, 1], 1, 0, [0]],
      [[0, 1], 1, 0, [0]],
      [[0, 1], 0, 0, [0, 1]],
      [[0, 1], 0, 0, [0, 1]],
      [[0, 1], 0, 2, [2, 1]],
      [[0, 1], 2, 0, [0, 1]],
      [[0, 1, 2], 0, 2, [2, 1]],
      [[0, 1, 2], 2, 0, [0, 1]],
      [[0, 1, 2], 0, 1, [1, 2]],
      [[0, 1, 2], 1, 0, [0, 2]],
      [[0, 1, 2], 0, 0, [0, 1, 2]],
      [[0, 1, 2], 1, 1, [0, 1, 2]],
      [[0, 1, 2], 2, 2, [0, 1, 2]],
      [[0, 1, 2, 3], 0, 3, [3, 1, 2]],
      [[0, 1, 2, 3], 0, 2, [2, 1, 3]],
      [[0, 1, 2, 3], 0, 1, [1, 2, 3]],
      [[0, 1, 2, 3], 0, 0, [0, 1, 2, 3]],
      [[0, 1, 2, 3], 1, 3, [0, 3, 2]],
      [[0, 1, 2, 3], 1, 2, [0, 2, 3]],
      [[0, 1, 2, 3], 1, 1, [0, 1, 2, 3]],
      [[0, 1, 2, 3], 1, 0, [0, 2, 3]],
      [[0, 1, 2, 3], 2, 3, [0, 1, 3]],
      [[0, 1, 2, 3], 2, 2, [0, 1, 2, 3]],
      [[0, 1, 2, 3], 2, 1, [0, 1, 3]],
      [[0, 1, 2, 3], 2, 0, [0, 1, 3]],
      [[0, 1, 2, 3], 3, 3, [0, 1, 2, 3]],
      [[0, 1, 2, 3], 3, 2, [0, 1, 2]],
      [[0, 1, 2, 3], 3, 1, [0, 1, 2]],
      [[0, 1, 2, 3], 3, 0, [0, 1, 2]],
    ];

    table.forEach(([iterable, from, to, expected]) => {
      const set = new OrderedSet(iterable);
      set.replace(from, to);

      assertEquals([...set], expected);
    });
  });
});
