import { Document } from "./documents/document.ts";
import { assertEquals, describe, it } from "../../_dev_deps.ts";
import { tree } from "../../internal.ts";

const document = new Document();

const A = document.createElement("A");
const B = document.createTextNode("B");
const C = document.createElement("C");
const D = document.createElement("D");
const E = document.createTextNode("E");
const F = document.createTextNode("F");

A.appendChild(B);
A.appendChild(C);
C.appendChild(D);
C.appendChild(E);
C.appendChild(F);

// A - B
// | - C
//   | - D
//     | E
//     | F

describe("TextTree", () => {
  it("contiguousTextNodes", () => {
    const table: [Node, Node[]][] = [
      [A, []],
      [B, [B]],
      [C, [B]],
      [D, []],
      [E, [E, F]],
      [F, [E, F]],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...tree.contiguousTextNodes(node)], expected);
    });
  });

  it("childTextContent", () => {
    const table: [Node, string][] = [
      [A, "B"],
      [B, ""],
      [C, "EF"],
      [D, ""],
      [E, ""],
      [F, ""],
    ];

    table.forEach(([node, expected]) => {
      assertEquals(tree.childTextContent(node), expected);
    });
  });

  it("descendantTextContent", () => {
    const table: [Node, string][] = [
      [A, "BEF"],
      [B, ""],
      [C, "EF"],
      [D, ""],
      [E, ""],
      [F, ""],
    ];

    table.forEach(([node, expected]) => {
      assertEquals(tree.descendantTextContent(node), expected);
    });
  });
});
