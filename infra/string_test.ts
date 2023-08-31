import {
  concatString,
  matchASCIICaseInsensitive,
  toASCIILowerCase,
} from "./string.ts";
import {
  assert,
  assertEquals,
  assertFalse,
  describe,
  it,
} from "../_dev_deps.ts";
import { List } from "./data_structures/list.ts";

describe("toASCIILowerCase", () => {
  it("should return lower case", () => {
    const table: [string, string][] = [
      ["", ""],
      [" ", " "],
      ["a", "a"],
      ["A", "a"],
      ["Ç", "Ç"],
      ["ç", "ç"],
      ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"],
      ["ä", "ä"],
      ["Ä", "Ä"],
      ["🤔", "🤔"],
      ["@", "@"], // Char code: 64
      ["[", "["], // Char code: 91
    ];

    table.forEach(([left, right]) => {
      assertEquals(toASCIILowerCase(left), right);
    });
  });
});

describe("matchASCIICaseInsensitive", () => {
  it("should return true", () => {
    const table: [string, string][] = [
      ["", ""],
      ["a", "A"],
      ["A", "a"],
    ];

    table.forEach(([left, right]) => {
      assert(matchASCIICaseInsensitive(left, right));
    });
  });

  it("should return false", () => {
    const table: [string, string][] = [
      ["", " "],
      ["a", "b"],
      ["\u212a", "K"],
      ["\u212a", "k"],
    ];

    table.forEach(([left, right]) => {
      assertFalse(matchASCIICaseInsensitive(left, right));
    });
  });
});

describe("concatString", () => {
  it("should return concat string without separator", () => {
    const table: [string[], string][] = [
      [[""], ""],
      [[" "], " "],
      [["", ""], ""],
      [[" ", " "], "  "],
      [["a", "b"], "ab"],
      [["A", "b"], "Ab"],
      [["あ", "亜"], "あ亜"],
    ];

    table.forEach(([left, right]) => {
      assertEquals(concatString(new List(left)), right);
    });
  });

  it("should return concat string with separator", () => {
    const table: [string[], string, string][] = [
      [[""], "", ""],
      [["", ""], "", ""],
      [["a", ""], "", "a"],
      [["a", "b"], "", "ab"],
      [["a", "b"], " ", "a b"],
      [["a", "b"], ":", "a:b"],
      [["a", "b", "c", "d"], ":", "a:b:c:d"],
    ];

    table.forEach(([left, separator, right]) => {
      assertEquals(concatString(new List(left), separator), right);
    });
  });
});
