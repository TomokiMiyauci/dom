import { Tree } from "./tree.ts";
import {
  assert,
  assertEquals,
  assertFalse,
  describe,
  equal,
  it,
} from "../_dev_deps.ts";

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

tree.children(A).append(B);
tree.children(B).append(C);
tree.children(C).append(D);
tree.children(C).append(E);
tree.children(B).append(F);
tree.children(F).append(G);
tree.children(F).append(H);
tree.children(F).append(I);
tree.children(A).append(J);
tree.children(J).append(K);
tree.children(J).append(L);

import { permutationsWithReplacement } from "npm:combinatorial-generators";

const allCombinations = [
  ...permutationsWithReplacement([A, B, C, D, E, F, G, H, I, J, K, L], 2),
] as [object, object][];

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

  it("precedeSiblings", () => {
    const table: [object, unknown[]][] = [
      [A, []],
      [B, []],
      [C, []],
      [D, []],
      [E, [D]],
      [F, [C]],
      [G, []],
      [H, [G]],
      [I, [H, G]],
      [J, [B]],
      [K, []],
      [L, [K]],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...tree.precedeSiblings(node)], expected);
    });
  });

  it("index", () => {
    const table: [object, number][] = [
      [A, 0],
      [B, 0],
      [C, 0],
      [D, 0],
      [E, 1],
      [F, 1],
      [G, 0],
      [H, 1],
      [I, 2],
      [J, 1],
      [K, 0],
      [L, 1],
    ];

    table.forEach(([node, expected]) => {
      assertEquals(tree.index(node), expected);
    });
  });

  it("isChild", () => {
    const table: [object, object][] = [
      [B, A],
      [J, A],
      [C, B],
      [F, B],
      [D, C],
      [E, C],
      [G, F],
      [H, F],
      [I, F],
      [K, J],
      [L, J],
    ];

    testAll(table, tree.isChild.bind(tree));
  });

  it("isChild", () => {
    const table: [object, object][] = [
      [B, A],
      [J, A],
      [C, B],
      [F, B],
      [D, C],
      [E, C],
      [G, F],
      [H, F],
      [I, F],
      [K, J],
      [L, J],
    ];

    testAll(table, tree.isChild.bind(tree));
  });

  it("isDescendant", () => {
    const table: [object, object][] = [
      [B, A],
      [C, A],
      [C, B],
      [D, A],
      [D, B],
      [D, C],
      [E, A],
      [E, B],
      [E, C],
      [F, A],
      [F, B],
      [G, A],
      [G, B],
      [G, F],
      [H, A],
      [H, B],
      [H, F],
      [I, A],
      [I, B],
      [I, F],
      [J, A],
      [K, A],
      [K, J],
      [L, A],
      [L, J],
    ];

    testAll(table, tree.isDescendant.bind(tree));
  });

  it("isInclusiveDescendant", () => {
    const table: [object, object][] = [
      [A, A],
      [B, A],
      [B, B],
      [C, A],
      [C, B],
      [C, C],
      [D, A],
      [D, B],
      [D, C],
      [D, D],
      [E, A],
      [E, B],
      [E, C],
      [E, E],
      [F, A],
      [F, B],
      [F, F],
      [G, A],
      [G, B],
      [G, F],
      [G, G],
      [H, A],
      [H, B],
      [H, F],
      [H, H],
      [I, A],
      [I, B],
      [I, F],
      [I, I],
      [J, A],
      [J, J],
      [K, A],
      [K, J],
      [K, K],
      [L, A],
      [L, J],
      [L, L],
    ];

    testAll(table, tree.isInclusiveDescendant.bind(tree));
  });

  it("isAncestor", () => {
    const table: [object, object][] = [
      [A, B],
      [A, C],
      [A, D],
      [A, E],
      [A, F],
      [A, G],
      [A, H],
      [A, I],
      [A, J],
      [A, K],
      [A, L],
      [B, C],
      [B, D],
      [B, E],
      [B, F],
      [B, G],
      [B, H],
      [B, I],
      [C, D],
      [C, E],
      [F, G],
      [F, H],
      [F, I],
      [J, K],
      [J, L],
    ];

    testAll(table, tree.isAncestor.bind(tree));
  });

  it("isInclusiveAncestor", () => {
    const table: [object, object][] = [
      [A, A],
      [A, B],
      [A, C],
      [A, D],
      [A, E],
      [A, F],
      [A, G],
      [A, H],
      [A, I],
      [A, J],
      [A, K],
      [A, L],
      [B, B],
      [B, C],
      [B, D],
      [B, E],
      [B, F],
      [B, G],
      [B, H],
      [B, I],
      [C, C],
      [C, D],
      [C, E],
      [D, D],
      [E, E],
      [F, F],
      [F, G],
      [F, H],
      [F, I],
      [G, G],
      [H, H],
      [I, I],
      [J, J],
      [J, K],
      [J, L],
      [K, K],
      [L, L],
    ];

    testAll(table, tree.isInclusiveAncestor.bind(tree));
  });

  it("isInclusiveAncestor", () => {
    const table: [object, object][] = [
      [A, A],
      [A, B],
      [A, C],
      [A, D],
      [A, E],
      [A, F],
      [A, G],
      [A, H],
      [A, I],
      [A, J],
      [A, K],
      [A, L],
      [B, B],
      [B, C],
      [B, D],
      [B, E],
      [B, F],
      [B, G],
      [B, H],
      [B, I],
      [C, C],
      [C, D],
      [C, E],
      [D, D],
      [E, E],
      [F, F],
      [F, G],
      [F, H],
      [F, I],
      [G, G],
      [H, H],
      [I, I],
      [J, J],
      [J, K],
      [J, L],
      [K, K],
      [L, L],
    ];

    testAll(table, tree.isInclusiveAncestor.bind(tree));
  });

  it("isPreceding", () => {
    const table: [object, object][] = [
      [A, B],
      [A, C],
      [A, D],
      [A, E],
      [A, F],
      [A, G],
      [A, H],
      [A, I],
      [A, J],
      [A, K],
      [A, L],
      [B, C],
      [B, D],
      [B, E],
      [B, F],
      [B, G],
      [B, H],
      [B, I],
      [B, J],
      [B, K],
      [B, L],
      [C, D],
      [C, E],
      [C, F],
      [C, G],
      [C, H],
      [C, I],
      [C, J],
      [C, K],
      [C, L],
      [D, E],
      [D, F],
      [D, G],
      [D, H],
      [D, I],
      [D, J],
      [D, K],
      [D, L],
      [E, F],
      [E, G],
      [E, H],
      [E, I],
      [E, J],
      [E, K],
      [E, L],
      [F, G],
      [F, H],
      [F, I],
      [F, J],
      [F, K],
      [F, L],
      [G, H],
      [G, I],
      [G, J],
      [G, K],
      [G, L],
      [H, I],
      [H, J],
      [H, K],
      [H, L],
      [I, J],
      [I, K],
      [I, L],
      [J, K],
      [J, L],
      [K, L],
    ];

    testAll(table, tree.isPreceding.bind(tree));
  });

  it("isFollowing", () => {
    const table: [object, object][] = [
      [B, A],
      [C, A],
      [C, B],
      [D, A],
      [D, B],
      [D, C],
      [E, A],
      [E, B],
      [E, C],
      [E, D],
      [F, A],
      [F, B],
      [F, C],
      [F, D],
      [F, E],
      [G, A],
      [G, B],
      [G, C],
      [G, D],
      [G, E],
      [G, F],
      [H, A],
      [H, B],
      [H, C],
      [H, D],
      [H, E],
      [H, F],
      [H, G],
      [I, A],
      [I, B],
      [I, C],
      [I, D],
      [I, E],
      [I, F],
      [I, G],
      [I, H],
      [J, A],
      [J, B],
      [J, C],
      [J, D],
      [J, E],
      [J, F],
      [J, G],
      [J, H],
      [J, I],
      [K, A],
      [K, B],
      [K, C],
      [K, D],
      [K, E],
      [K, F],
      [K, G],
      [K, H],
      [K, I],
      [K, J],
      [L, A],
      [L, B],
      [L, C],
      [L, D],
      [L, E],
      [L, F],
      [L, G],
      [L, H],
      [L, I],
      [L, J],
      [L, K],
    ];

    testAll(table, tree.isFollowing.bind(tree));
  });
});

function testAll(
  success: [object, object][],
  predicate: (left: object, right: object) => boolean,
): void {
  const fails = allCombinations.filter((array) => {
    return !success.some((v) => equal(v, array));
  });

  success.forEach(([target, of]) => {
    assert(predicate(target, of), Deno.inspect([target, of]));
  });

  fails.forEach(([target, of]) => {
    assertFalse(predicate(target, of), Deno.inspect([target, of]));
  });
}
