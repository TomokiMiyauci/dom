import { Tree } from "./tree.ts";
import { assert, assertEquals, describe, it } from "../../_dev_deps.ts";

/**
 *                 ______________A______________
 *                /                             \
 *         ______B______                   _____J______
 *        /             \                 /            \
 *     __C__           __F__             K              L
 *    /     \         /  |  \
 *   D       E       G   H   I
 */
const A = { _: "A" };
const B = { _: "B" };
const C = { _: "C" };
const D = { _: "D" };
const E = { _: "E" };
const F = { _: "F" };
const G = { _: "G" };
const H = { _: "H" };
const I = { _: "I" };
const J = { _: "J" };
const K = { _: "K" };
const L = { _: "L" };

const tree = new Tree();

tree.appendChild(A, B);
tree.appendChild(B, C);
tree.appendChild(C, D);
tree.appendChild(C, E);
tree.appendChild(B, F);
tree.appendChild(F, G);
tree.appendChild(F, H);
tree.appendChild(F, I);
tree.appendChild(A, J);
tree.appendChild(J, K);
tree.appendChild(J, L);

describe("tree", () => {
  it("firstChild", () => {
    const table: [object, unknown][] = [
      [A, B],
      [B, C],
      [C, D],
      [D, null],
      [E, null],
      [F, G],
      [G, null],
      [H, null],
      [I, null],
      [J, K],
      [K, null],
      [L, null],
    ];

    table.forEach(([node, expected]) => {
      assert(tree.firstChild(node) === expected);
    });
  });

  it("lastChild", () => {
    const table: [object, unknown][] = [
      [A, J],
      [B, F],
      [C, E],
      [D, null],
      [E, null],
      [F, I],
      [G, null],
      [H, null],
      [I, null],
      [J, L],
      [K, null],
      [L, null],
    ];

    table.forEach(([node, expected]) => {
      assert(tree.lastChild(node) === expected);
    });
  });

  it("previousSibling", () => {
    const table: [object, unknown][] = [
      [A, null],
      [B, null],
      [C, null],
      [D, null],
      [E, D],
      [F, C],
      [G, null],
      [H, G],
      [I, H],
      [J, B],
      [K, null],
      [L, K],
    ];

    table.forEach(([node, expected]) => {
      assert(tree.previousSibling(node) === expected);
    });
  });

  it("nextSibling", () => {
    const table: [object, unknown][] = [
      [A, null],
      [B, J],
      [C, F],
      [D, E],
      [E, null],
      [F, null],
      [G, H],
      [H, I],
      [I, null],
      [J, null],
      [K, L],
      [L, null],
    ];

    table.forEach(([node, expected]) => {
      assert(tree.nextSibling(node) === expected);
    });
  });

  it("parent", () => {
    const table: [object, unknown][] = [
      [A, null],
      [B, A],
      [C, B],
      [D, C],
      [E, C],
      [F, B],
      [G, F],
      [H, F],
      [I, F],
      [J, A],
      [K, J],
      [L, J],
    ];

    table.forEach(([node, expected]) => {
      assert(tree.parent(node) === expected);
    });
  });

  it("root", () => {
    const table: [object, unknown][] = [
      [A, A],
      [B, A],
      [C, A],
      [D, A],
      [E, A],
      [F, A],
      [G, A],
      [H, A],
      [I, A],
      [J, A],
      [K, A],
      [L, A],
    ];

    table.forEach(([node, expected]) => {
      assert(tree.root(node) === expected);
    });
  });

  it("children", () => {
    const table: [object, unknown[]][] = [
      [A, [B, J]],
      [B, [C, F]],
      [C, [D, E]],
      [D, []],
      [E, []],
      [F, [G, H, I]],
      [G, []],
      [H, []],
      [I, []],
      [J, [K, L]],
      [K, []],
      [L, []],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...tree.children(node)], expected);
    });
  });

  it("ancestors", () => {
    const table: [object, unknown[]][] = [
      [A, []],
      [B, [A]],
      [C, [B, A]],
      [D, [C, B, A]],
      [E, [C, B, A]],
      [F, [B, A]],
      [G, [F, B, A]],
      [H, [F, B, A]],
      [I, [F, B, A]],
      [J, [A]],
      [K, [J, A]],
      [L, [J, A]],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...tree.ancestors(node)], expected);
    });
  });

  it("inclusiveAncestors", () => {
    const table: [object, unknown[]][] = [
      [A, [A]],
      [B, [B, A]],
      [C, [C, B, A]],
      [D, [D, C, B, A]],
      [E, [E, C, B, A]],
      [F, [F, B, A]],
      [G, [G, F, B, A]],
      [H, [H, F, B, A]],
      [I, [I, F, B, A]],
      [J, [J, A]],
      [K, [K, J, A]],
      [L, [L, J, A]],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...tree.inclusiveAncestors(node)], expected);
    });
  });

  it("descendants", () => {
    const table: [object, unknown[]][] = [
      [A, [B, C, D, E, F, G, H, I, J, K, L]],
      [B, [C, D, E, F, G, H, I]],
      [C, [D, E]],
      [D, []],
      [E, []],
      [F, [G, H, I]],
      [G, []],
      [H, []],
      [I, []],
      [J, [K, L]],
      [K, []],
      [L, []],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...tree.descendants(node)], expected);
    });
  });

  it("inclusiveDescendants", () => {
    const table: [object, unknown[]][] = [
      [A, [A, B, C, D, E, F, G, H, I, J, K, L]],
      [B, [B, C, D, E, F, G, H, I]],
      [C, [C, D, E]],
      [D, [D]],
      [E, [E]],
      [F, [F, G, H, I]],
      [G, [G]],
      [H, [H]],
      [I, [I]],
      [J, [J, K, L]],
      [K, [K]],
      [L, [L]],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...tree.inclusiveDescendants(node)], expected);
    });
  });

  it("siblings", () => {
    const table: [object, unknown[]][] = [
      [A, []],
      [B, [J]],
      [C, [F]],
      [D, [E]],
      [E, [D]],
      [F, [C]],
      [G, [H, I]],
      [H, [G, I]],
      [I, [G, H]],
      [J, [B]],
      [K, [L]],
      [L, [K]],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...tree.siblings(node)], expected);
    });
  });

  it("inclusiveSiblings", () => {
    const table: [object, unknown[]][] = [
      [A, []],
      [B, [B, J]],
      [C, [C, F]],
      [D, [D, E]],
      [E, [D, E]],
      [F, [C, F]],
      [G, [G, H, I]],
      [H, [G, H, I]],
      [I, [G, H, I]],
      [J, [B, J]],
      [K, [K, L]],
      [L, [K, L]],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...tree.inclusiveSiblings(node)], expected);
    });
  });

  it("precede", () => {
    const table: [object, unknown][] = [
      [A, null],
      [B, A],
      [C, B],
      [D, C],
      [E, D],
      [F, E],
      [G, F],
      [H, G],
      [I, H],
      [J, I],
      [K, J],
      [L, K],
    ];

    table.forEach(([node, expected]) => {
      assertEquals(tree.precede(node), expected);
    });
  });

  it("precedes", () => {
    const table: [object, unknown[]][] = [
      [A, []],
      [B, [A]],
      [C, [B, A]],
      [D, [C, B, A]],
      [E, [D, C, B, A]],
      [F, [E, D, C, B, A]],
      [G, [F, E, D, C, B, A]],
      [H, [G, F, E, D, C, B, A]],
      [I, [H, G, F, E, D, C, B, A]],
      [J, [I, H, G, F, E, D, C, B, A]],
      [K, [J, I, H, G, F, E, D, C, B, A]],
      [L, [K, J, I, H, G, F, E, D, C, B, A]],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...tree.precedes(node)], expected);
    });
  });

  it("follow", () => {
    const table: [object, unknown][] = [
      [A, B],
      [B, C],
      [C, D],
      [D, E],
      [E, F],
      [F, G],
      [G, H],
      [H, I],
      [I, J],
      [J, K],
      [K, L],
      [L, null],
    ];

    table.forEach(([node, expected]) => {
      assertEquals(tree.follow(node), expected);
    });
  });

  it("follows", () => {
    const table: [object, unknown[]][] = [
      [A, [B, C, D, E, F, G, H, I, J, K, L]],
      [B, [C, D, E, F, G, H, I, J, K, L]],
      [C, [D, E, F, G, H, I, J, K, L]],
      [D, [E, F, G, H, I, J, K, L]],
      [E, [F, G, H, I, J, K, L]],
      [F, [G, H, I, J, K, L]],
      [G, [H, I, J, K, L]],
      [H, [I, J, K, L]],
      [I, [J, K, L]],
      [J, [K, L]],
      [K, [L]],
      [L, []],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...tree.follows(node)], expected);
    });
  });
});
