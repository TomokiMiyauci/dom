import { OrderedSet } from "./set.ts";
import {
  assert,
  assertEquals,
  assertFalse,
  describe,
  it,
} from "../../_dev_deps.ts";

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

  it("should not insert if the item exists", () => {
    const set = new OrderedSet([0, 1, 2]);

    assertFalse(set.insert(0, 0));
    assertEquals([...set], [0, 1, 2]);
  });

  it("should not insert if the item exists 2", () => {
    const set = new OrderedSet([0, 1, 2]);

    assertFalse(set.insert(1, 0));
    assertEquals([...set], [0, 1, 2]);
  });

  it("should not insert then add", () => {
    const set = new OrderedSet();

    assertFalse(set.insert(1, 0));
    set.append(0);
    assertEquals([...set], [0]);
  });

  it("should remove matched condition", () => {
    const set = new OrderedSet([0]);

    assertEquals(set.remove(() => true), [[0, 0]]);
    assertEquals([...set], []);

    set.append(0);
    assertEquals([...set], [0]);
  });

  it("should replace then add", () => {
    const set = new OrderedSet([0, 1, 2]);

    set.replace(2, 0);
    assertEquals([...set], [0, 1]);

    set.append(0);
    assertEquals([...set], [0, 1]);

    set.append(2);
    assertEquals([...set], [0, 1, 2]);
  });

  it("should replace then add 2", () => {
    const set = new OrderedSet([0, 1, 2]);

    set.replace(0, 0);
    assertEquals([...set], [0, 1, 2]);

    set.append(0);
    assertEquals([...set], [0, 1, 2]);
  });

  it("should replace then add 3", () => {
    const set = new OrderedSet([0, 1, 2]);

    set.replace(0, 2);
    assertEquals([...set], [2, 1]);

    set.append(0);
    assertEquals([...set], [2, 1, 0]);

    set.append(2);
    assertEquals([...set], [2, 1, 0]);
  });

  it("should return indexed item", () => {
    const set = new OrderedSet([1, 2, 3]);

    assertEquals(set[0], 1);
    assertEquals(set[1], 2);
    assertEquals(set[2], 3);
    assertEquals(set[3], undefined);
    assertEquals(set[-1], undefined);
    assertEquals(set[0.1], undefined);

    set.prepend(0);
    assertEquals(set[0], 0);
    assertEquals(set[1], 1);
  });

  it("should return cloned", () => {
    const set = new OrderedSet([1, 2, 3]);

    const newSet = set.clone();

    assert(set !== newSet);
    assertEquals([...set], [1, 2, 3]);
    assertEquals([...newSet], [1, 2, 3]);

    newSet.append(4);
    assertEquals([...set], [1, 2, 3]);
    assertEquals([...newSet], [1, 2, 3, 4]);
  });
});
