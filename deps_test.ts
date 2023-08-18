import { divide, last, len } from "./deps.ts";
import { assertEquals, describe, it } from "./_dev_deps.ts";

describe("len", () => {
  it("should return number of items", () => {
    const table: [Iterable<unknown>, number][] = [
      [[], 0],
      [[0], 1],
      [[0, 0, 0], 3],
      [{
        *[Symbol.iterator]() {
          yield 0;
          yield 0;
        },
      }, 2],
      [new Array(10000), 10000],
    ];

    table.forEach(([iterable, expected]) => {
      assertEquals(len(iterable), expected);
    });
  });
});

describe("last", () => {
  it("should return last item", () => {
    const table: [Iterable<unknown>, unknown][] = [
      [[], undefined],
      [[0], 0],
      [[0, 1, 2], 2],
      [{
        *[Symbol.iterator]() {
          yield "a";
          yield "b";
        },
      }, "b"],
    ];

    table.forEach(([iterable, expected]) => {
      assertEquals(last(iterable), expected);
    });
  });
});

describe("divide", () => {
  it("should return divided tuple", () => {
    const table: [string, string, [string, string]][] = [
      ["abc", "", ["abc", ""]],
      ["abc", "b", ["a", "c"]],
      ["abcbc", "b", ["a", "cbc"]],
      ["abcbc", "a", ["", "bcbc"]],
      ["abcbc", "c", ["ab", "bc"]],
      ["abcbc", "d", ["abcbc", ""]],
    ];

    table.forEach(([input, delimiter, expected]) => {
      assertEquals(divide(input, delimiter), expected);
    });
  });
});
