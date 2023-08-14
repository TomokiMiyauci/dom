import { List } from "./list.ts";
import { assert, assertEquals, describe, it } from "../_dev_deps.ts";
import { isOdd } from "https://deno.land/x/isx@1.5.0/number/is_odd.ts";

describe("List", () => {
  it("should be size 0 by default", () => {
    assertEquals(new List().size, 0);
  });

  it("should be size 2", () => {
    assertEquals(new List(["a", 0]).size, 2);
  });

  it("should not yield by default", () => {
    assertEquals([...new List()], []);
  });

  it("append should add end of the list", () => {
    const list = new List();

    list.append(0);

    assertEquals([...list], [0]);

    list.append(1);

    assertEquals([...list], [0, 1]);

    list.append("a");
    assertEquals([...list], [0, 1, "a"]);
  });

  it("extend should append other items", () => {
    const leftItems = [0, 1, 2];
    const rightItems = [3, 4, 5];
    const left = new List(leftItems);
    const right = new List(rightItems);

    left.extend(right);

    assertEquals([...left], [...leftItems, ...rightItems]);
    assertEquals([...right], [...rightItems]);
  });

  it("prepend should add beginning of items", () => {
    const list = new List([0, 1]);

    list.prepend(2);

    assertEquals([...list], [2, 0, 1]);

    list.prepend(3);

    assertEquals([...list], [3, 2, 0, 1]);
  });

  it("insert always should not add if empty", () => {
    const list = new List();

    list.insert(0, 1);
    assertEquals([...list], []);

    list.insert(1, 1);
    assertEquals([...list], []);

    list.insert(-1, 1);
    assertEquals([...list], []);
  });

  it("insert should add before that item if 0", () => {
    const list = new List([0]);

    list.insert(0, 1);
    assertEquals([...list], [1, 0]);
  });

  it("insert should not add if the specified index exceed size", () => {
    const list = new List([0]);

    list.insert(1, 1);
    assertEquals([...list], [0]);
  });

  it("insert should add between", () => {
    const list = new List([0, 1, 2]);

    list.insert(1, 3);
    assertEquals([...list], [0, 3, 1, 2]);
  });

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

  it("should remove all items if condition is true", () => {
    const list = new List([0, 1, 2, 3, 4]);

    list.remove(() => true);

    assertEquals([...list], []);
  });

  it("should remove all items if condition is true", () => {
    const list = new List([0, 1, 2, 3, 4]);

    list.remove(isOdd);

    assertEquals([...list], [0, 2, 4]);
  });

  it("should do nothing if condition is false", () => {
    const list = new List([0, 1, 2, 3, 4]);

    list.remove(() => false);

    assertEquals([...list], [0, 1, 2, 3, 4]);
  });

  it("should be empty", () => {
    const list = new List([0, 1, 2, 3, 4]);
    list.empty();

    assertEquals([...list], []);
  });

  it("should be true if the item does exist", () => {
    const list = new List([0, 1, 2, 3, 4]);

    assert(list.contains(2));
  });

  it("should be false if the item does not exist", () => {
    const list = new List([0, 1, 2, 3, 4]);

    assert(!list.contains(5));
  });

  it("should access by index", () => {
    const list = new List([0, 1, 2, 3, 4]);

    assertEquals(list[2], 2);
  });

  it("should return undefined if the index is out of range", () => {
    const list = new List([0, 1, 2, 3, 4]);

    assertEquals(list[-1], undefined);
    assertEquals(list[5], undefined);
    assertEquals(list[4.1], undefined);
  });

  it("should return cloned list", () => {
    const list = new List([0, 1, 2, 3, 4]);
    const other = list.clone();

    assert(list !== other);
    assertEquals([...list], [...other]);
  });

  it("should shallow copy", () => {
    const list = new List([{}]);
    const other = list.clone();

    assertEquals(list[0], other[0]);
  });

  it("should return true if size is 0", () => {
    assert(new List().isEmpty);
  });

  it("should return false if size is not 0", () => {
    assert(!new List([1]).isEmpty);
  });
});
