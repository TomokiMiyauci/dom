import {
  type ExtractResult,
  Namespace,
  validate,
  validateAndExtract,
} from "./namespace.ts";
import {
  assertEquals,
  assertFalse,
  assertThrows,
  describe,
  it,
} from "../_dev_deps.ts";

describe("validate", () => {
  it("should return void if the input is valid", () => {
    const table: string[] = [
      "a",
      "a:b",
      "a-b",
      "a:a-b",
    ];

    table.forEach((value) => assertFalse(validate(value)));
  });

  it("should throw error", () => {
    const table: string[] = [
      "",
      " ",
      "  ",
      "?",
      "a:",
      "a::a",
      "a:a:",
      "a:a:a",
    ];

    table.forEach((value) => assertThrows(() => validate(value), DOMException));
  });
});

describe("validateAndExtract", () => {
  it("should return ExtractResult if the input is valid", () => {
    const table: [
      namespace: string | null,
      qualifiedName: string,
      expected: ExtractResult,
    ][] = [
      ["", "a", { namespace: null, prefix: null, localName: "a" }],
      ["?", "a", { namespace: "?", prefix: null, localName: "a" }],
      [" ", "a", { namespace: " ", prefix: null, localName: "a" }],
      [" a", "a", { namespace: " a", prefix: null, localName: "a" }],
      [null, "a", { namespace: null, prefix: null, localName: "a" }],
      ["a", "a", { namespace: "a", prefix: null, localName: "a" }],
      ["a", "a:b", { namespace: "a", prefix: "a", localName: "b" }],
      ["a", "abc:def", { namespace: "a", prefix: "abc", localName: "def" }],
      [Namespace.XML, "xml:a", {
        namespace: Namespace.XML,
        prefix: "xml",
        localName: "a",
      }],
      [" ", "a:xmlns", { namespace: " ", prefix: "a", localName: "xmlns" }],
      [Namespace.XMLNS, "xmlns", {
        namespace: Namespace.XMLNS,
        prefix: null,
        localName: "xmlns",
      }],
      [Namespace.XMLNS, "xmlns:a", {
        namespace: Namespace.XMLNS,
        prefix: "xmlns",
        localName: "a",
      }],
    ];

    table.forEach(([namespace, qualifiedName, expected]) =>
      assertEquals(validateAndExtract(namespace, qualifiedName), expected)
    );
  });

  it("should throw error", () => {
    const table: [
      namespace: string | null,
      qualifiedName: string,
    ][] = [
      [null, "a::"],
      [null, "a:b"],
      [" ", "xml:a"],
      [" ", "xmlns"],
      [" ", "xmlns:a"],
    ];

    table.forEach(([namespace, qualifiedName]) =>
      assertThrows(
        () => validateAndExtract(namespace, qualifiedName),
        DOMException,
      )
    );
  });
});
