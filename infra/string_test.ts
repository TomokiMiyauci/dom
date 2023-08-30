import { matchASCIICaseInsensitive } from "./string.ts";
import { assert, assertFalse, describe, it } from "../_dev_deps.ts";

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
