import { matchASCIICaseInsensitive, toASCIILowerCase } from "./string.ts";
import {
  assert,
  assertEquals,
  assertFalse,
  describe,
  it,
} from "../_dev_deps.ts";

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
