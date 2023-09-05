import {
  getDescendants,
  getFollow,
  getFollowingSiblings,
  getFollows,
  getInclusiveAncestors,
  getIndex,
  getNextSibling,
  getPrecedings,
  getPrecedingSiblings,
  getPreviousSibling,
  getRoot,
  getSiblings,
  isAncestorOf,
  isChildOf,
  isDescendantOf,
  isFollowOf,
  isInclusiveAncestorOf,
  isInclusiveDescendantOf,
  isInclusiveSiblingOf,
  isPrecedeOf,
  isSiblingOf,
  orderSubtree,
  orderTree,
  TreeNode,
} from "./tree.ts";
import {
  assert,
  assertEquals,
  assertFalse,
  describe,
  it,
} from "../../_dev_deps.ts";
import { OrderedSet } from "../../infra/data_structures/set.ts";

class Node implements TreeNode {
  _parent: TreeNode | null = null;

  _children: OrderedSet<TreeNode> = new OrderedSet();

  appendChild(node: TreeNode) {
    if (this === node) throw new Error();

    this._children.append(node);
    node._parent = this;
  }
}

const root = new Node();
const parent = new Node();
const childA = new Node();
const childB = new Node();
const childC = new Node();
const grandChildA1 = new Node();
const grandChildB1 = new Node();
const grandChildB2 = new Node();
const grandChildC1 = new Node();
const grandChildC2 = new Node();
const grandChildC3 = new Node();
const other = new Node();

root.appendChild(parent);
parent.appendChild(childA);
parent.appendChild(childB);
parent.appendChild(childC);
childA.appendChild(grandChildA1);
childB.appendChild(grandChildB1);
childB.appendChild(grandChildB2);
childC.appendChild(grandChildC1);
childC.appendChild(grandChildC2);
childC.appendChild(grandChildC3);

describe("isChildOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [parent, root],
      [childA, parent],
      [childB, parent],
      [childC, parent],
      [grandChildA1, childA],
      [grandChildB1, childB],
      [grandChildB2, childB],
      [grandChildC1, childC],
      [grandChildC2, childC],
      [grandChildC3, childC],
    ];

    table.forEach(([target, of]) => {
      assert(isChildOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [root, root],
      [root, parent],
      [root, childA],
      [root, childB],
      [root, childC],
      [root, grandChildA1],
      [root, grandChildB1],
      [root, grandChildB2],
      [root, grandChildC1],
      [root, grandChildC2],
      [root, grandChildC3],
      [parent, parent],
      [parent, childA],
      [parent, childB],
      [parent, childC],
      [parent, grandChildA1],
      [parent, grandChildB1],
      [parent, grandChildB2],
      [parent, grandChildC1],
      [parent, grandChildC2],
      [parent, grandChildC3],
      [childA, root],
      [childA, childA],
      [childA, childB],
      [childA, childC],
      [childA, childC],
      [childA, grandChildA1],
      [childA, grandChildB1],
      [childA, grandChildB2],
      [childA, grandChildC1],
      [childA, grandChildC2],
      [childA, grandChildC3],
      [grandChildA1, root],
      [grandChildA1, parent],
      [grandChildA1, childB],
      [grandChildA1, childC],
      [grandChildA1, grandChildA1],
      [grandChildB1, grandChildB1],
      [grandChildB1, grandChildB2],
      [grandChildB2, grandChildB1],
      [grandChildB2, grandChildB2],
      [grandChildC1, grandChildC1],
      [grandChildC1, grandChildC2],
      [grandChildC1, grandChildC3],
      [grandChildC2, grandChildC1],
      [grandChildC2, grandChildC2],
      [grandChildC2, grandChildC3],
      [grandChildC3, grandChildC1],
      [grandChildC3, grandChildC2],
      [grandChildC3, grandChildC3],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isChildOf(target, of));
    });
  });
});

describe("isDescendantOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [parent, root],
      [childA, root],
      [childA, parent],
      [childB, root],
      [childB, parent],
      [childC, root],
      [childC, parent],
      [grandChildA1, root],
      [grandChildA1, parent],
      [grandChildA1, childA],
      [grandChildB2, childB],
      [grandChildC3, childC],
    ];

    table.forEach(([target, of]) => {
      assert(isDescendantOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [root, root],
      [root, parent],
      [root, childA],
      [root, grandChildA1],
      [parent, parent],
      [parent, childA],
      [parent, grandChildA1],
      [childA, childA],
      [childA, childB],
      [childA, childC],
      [childA, grandChildA1],
      [childA, grandChildB2],
      [childA, grandChildC3],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isDescendantOf(target, of));
    });
  });
});

describe("isInclusiveDescendantOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [root, root],
      [parent, root],
      [parent, parent],
      [childA, root],
      [childA, parent],
      [childA, childA],
      [childB, root],
      [childB, parent],
      [childC, root],
      [childC, parent],
      [grandChildA1, root],
      [grandChildA1, parent],
      [grandChildA1, childA],
      [grandChildB2, childB],
      [grandChildC3, childC],
    ];

    table.forEach(([target, of]) => {
      assert(isInclusiveDescendantOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [root, parent],
      [root, childA],
      [root, grandChildA1],
      [parent, childA],
      [parent, grandChildA1],
      [childA, childB],
      [childA, childC],
      [childA, grandChildA1],
      [childA, grandChildB2],
      [childA, grandChildC3],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isInclusiveDescendantOf(target, of));
    });
  });
});

describe("isAncestorOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [root, parent],
      [root, childA],
      [root, childB],
      [root, childC],
      [root, grandChildA1],
      [parent, childA],
      [parent, childB],
      [childA, grandChildA1],
      [childB, grandChildB2],
    ];

    table.forEach(([target, of]) => {
      assert(isAncestorOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [root, root],
      [parent, root],
      [parent, parent],
      [childA, childA],
      [childA, childB],
      [childA, childC],
      [childA, grandChildB2],
      [childA, grandChildC3],
      [childB, childB],
      [childB, childC],
      [childB, grandChildC3],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isAncestorOf(target, of));
    });
  });
});

describe("isInclusiveAncestorOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [root, root],
      [root, parent],
      [root, childA],
      [root, childB],
      [root, childC],
      [root, grandChildA1],
      [parent, childA],
      [parent, childB],
      [childA, grandChildA1],
      [childB, grandChildB2],
      [parent, parent],
      [childA, childA],
      [childB, childB],
    ];

    table.forEach(([target, of]) => {
      assert(isInclusiveAncestorOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [parent, root],
      [childA, childB],
      [childA, childC],
      [childA, grandChildB2],
      [childA, grandChildC3],
      [childB, childC],
      [childB, grandChildC3],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isInclusiveAncestorOf(target, of));
    });
  });
});

describe("isSiblingOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [parent, parent],
      [childA, childA],
      [childA, childB],
      [childA, childC],
      [childB, childA],
      [childB, childB],
      [childB, childC],
      [childC, childA],
      [childC, childB],
      [childC, childC],
      [grandChildB1, grandChildB1],
      [grandChildB1, grandChildB2],
      [grandChildB2, grandChildB1],
      [grandChildC1, grandChildC2],
      [grandChildC1, grandChildC3],
      [grandChildC2, grandChildC1],
      [grandChildC2, grandChildC3],
      [grandChildC3, grandChildC1],
      [grandChildC3, grandChildC2],
    ];

    table.forEach(([target, of]) => {
      assert(isSiblingOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [root, root],
      [root, parent],
      [root, childA],
      [root, grandChildA1],
      [parent, root],
      [parent, childA],
      [parent, grandChildA1],
      [childA, root],
      [childA, parent],
      [childA, grandChildA1],
      [childA, grandChildB2],
      [childA, grandChildC3],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isSiblingOf(target, of));
    });
  });
});

describe("isInclusiveSiblingOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [parent, parent],
      [childA, childA],
      [childA, childB],
      [childA, childC],
      [childB, childA],
      [childB, childB],
      [childB, childC],
      [childC, childA],
      [childC, childB],
      [childC, childC],
      [grandChildB1, grandChildB1],
      [grandChildB1, grandChildB2],
      [grandChildB2, grandChildB1],
      [grandChildC1, grandChildC2],
      [grandChildC1, grandChildC3],
      [grandChildC2, grandChildC1],
      [grandChildC2, grandChildC3],
      [grandChildC3, grandChildC1],
      [grandChildC3, grandChildC2],
      [root, root],
    ];

    table.forEach(([target, of]) => {
      assert(isInclusiveSiblingOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [root, parent],
      [root, childA],
      [root, grandChildA1],
      [parent, root],
      [parent, childA],
      [parent, grandChildA1],
      [childA, root],
      [childA, parent],
      [childA, grandChildA1],
      [childA, grandChildB2],
      [childA, grandChildC3],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isInclusiveSiblingOf(target, of));
    });
  });
});

describe("isPrecedeOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [parent, childA],
      [parent, childB],
      [parent, childC],
      [childA, grandChildA1],
      [childA, grandChildB2],
      [childA, grandChildC3],
      [childA, grandChildC3],
      [childA, childB],
      [childA, childC],
      [childB, grandChildB1],
      [childB, grandChildB2],
      [childB, grandChildC3],
      [childB, childC],
      [childC, grandChildC1],
      [childC, grandChildC2],
      [childC, grandChildC3],
      [grandChildA1, childB],
      [grandChildA1, childC],
      [grandChildA1, grandChildB1],
      [grandChildA1, grandChildB2],
      [grandChildA1, grandChildC3],
      [grandChildB1, childC],
      [grandChildB1, grandChildB2],
      [grandChildB1, grandChildC1],
      [grandChildB1, grandChildC2],
      [grandChildB1, grandChildC3],
      [grandChildC1, grandChildC2],
      [grandChildC1, grandChildC3],
      [grandChildC2, grandChildC3],
    ];

    table.forEach(([target, of]) => {
      assert(isPrecedeOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [parent, parent],
      [parent, other],
      [parent, root],
      [childA, root],
      [childA, parent],
      [childA, childA],
      [childB, root],
      [childB, parent],
      [childB, childA],
      [childB, childB],
      [childC, root],
      [childC, parent],
      [childC, childA],
      [childB, grandChildA1],
      [childC, grandChildB1],
      [childC, grandChildB2],
      [childC, childB],
      [childC, grandChildB2],
      [grandChildA1, root],
      [grandChildA1, parent],
      [grandChildA1, childA],
      [grandChildA1, grandChildA1],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isPrecedeOf(target, of));
    });
  });
});

describe("isFollowOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [parent, root],
      [childA, root],
      [childA, parent],
      [childB, root],
      [childB, parent],
      [childB, childA],
      [childC, root],
      [childC, parent],
      [childC, childA],
      [childC, grandChildA1],
      [childC, grandChildB1],
      [childC, childB],
      [childC, grandChildB1],
      [grandChildA1, root],
      [grandChildA1, parent],
      [grandChildA1, childA],
    ];

    table.forEach(([target, of]) => {
      assert(isFollowOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [parent, other],
      [parent, parent],
      [parent, childA],
      [parent, childB],
      [parent, childC],
      [childA, childA],
      [childA, childB],
      [childA, childB],
      [childA, childC],
      [childB, childB],
      [childB, childC],
      [grandChildA1, grandChildB1],
      [grandChildA1, grandChildB2],
      [grandChildA1, childB],
      [grandChildA1, childC],
      [grandChildA1, grandChildA1],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isFollowOf(target, of));
    });
  });
});

describe("getRoot", () => {
  it("should return root node", () => {
    const table: Node[] = [root, parent, childA, childB, grandChildA1];

    table.forEach((target) => {
      assert(getRoot(target) === root);
    });
  });
});

describe("getSiblings", () => {
  it("should return siblings", () => {
    const table: [Node, Node[]][] = [
      [root, []],
      [parent, [parent]],
      [childA, [childA, childB, childC]],
      [childB, [childA, childB, childC]],
      [childC, [childA, childB, childC]],
      [grandChildA1, [grandChildA1]],
      [grandChildB1, [grandChildB1, grandChildB2]],
      [grandChildB2, [grandChildB1, grandChildB2]],
      [grandChildC1, [grandChildC1, grandChildC2, grandChildC3]],
    ];

    table.forEach(([target, expected]) => {
      assertEquals([...getSiblings(target)], expected);
    });
  });
});

describe("getPrecedingSiblings", () => {
  it("should return preceding siblings", () => {
    const table: [Node, Node[]][] = [
      [root, []],
      [parent, []],
      [childA, []],
      [childB, [childA]],
      [childC, [childB, childA]],
      [grandChildA1, []],
      [grandChildB1, []],
      [grandChildB2, [grandChildB1]],
      [grandChildC1, []],
      [grandChildC2, [grandChildC1]],
      [grandChildC3, [grandChildC2, grandChildC1]],
    ];

    table.forEach(([target, expected]) => {
      assertEquals([...getPrecedingSiblings(target)], expected);
    });
  });
});

describe("getPreviousSibling", () => {
  it("should return previous sibling", () => {
    const table: [Node, Node | null][] = [
      [root, null],
      [parent, null],
      [childA, null],
      [childB, childA],
      [childC, childB],
      [grandChildA1, null],
      [grandChildB1, null],
      [grandChildB2, grandChildB1],
    ];

    table.forEach(([target, expected]) => {
      assertEquals(getPreviousSibling(target), expected);
    });
  });
});

describe("getFollowingSiblings", () => {
  it("should return following siblings", () => {
    const table: [Node, Node[]][] = [
      [root, []],
      [parent, []],
      [childA, [childB, childC]],
      [childB, [childC]],
      [childC, []],
      [grandChildA1, []],
      [grandChildB1, [grandChildB2]],
      [grandChildB2, []],
      [grandChildC1, [grandChildC2, grandChildC3]],
      [grandChildC2, [grandChildC3]],
      [grandChildC3, []],
    ];

    table.forEach(([target, expected]) => {
      assertEquals([...getFollowingSiblings(target)], expected);
    });
  });
});

describe("getNextSibling", () => {
  it("should return next sibling", () => {
    const table: [Node, Node | null][] = [
      [root, null],
      [parent, null],
      [childA, childB],
      [childB, childC],
      [childC, null],
      [grandChildA1, null],
      [grandChildB1, grandChildB2],
      [grandChildB2, null],
      [grandChildC1, grandChildC2],
      [grandChildC2, grandChildC3],
      [grandChildC3, null],
    ];

    table.forEach(([target, expected]) => {
      assertEquals(getNextSibling(target), expected);
    });
  });
});

describe("getPrecedings", () => {
  it("should return precedings", () => {
    const table: [Node, Node[]][] = [
      [root, []],
      [parent, [root]],
      [childA, [root, parent]],
      [grandChildA1, [root, parent, childA]],
      [childB, [root, parent, childA, grandChildA1]],
      [grandChildB1, [root, parent, childA, grandChildA1, childB]],
      [grandChildB2, [
        root,
        parent,
        childA,
        grandChildA1,
        childB,
        grandChildB1,
      ]],
      [childC, [
        root,
        parent,
        childA,
        grandChildA1,
        childB,
        grandChildB1,
        grandChildB2,
      ]],
      [grandChildC2, [
        root,
        parent,
        childA,
        grandChildA1,
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
      ]],
    ];

    table.forEach(([target, expected]) => {
      assertEquals([...getPrecedings(target)], expected);
    });
  });
});

describe("getFollows", () => {
  it("should return following nodes", () => {
    const table: [Node, Node[]][] = [
      [root, [
        parent,
        childA,
        grandChildA1,
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [parent, [
        childA,
        grandChildA1,
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [childA, [
        grandChildA1,
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildA1, [
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [childB, [
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildB1, [
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildB2, [
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [childC, [
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildC1, [
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildC2, [
        grandChildC3,
      ]],
      [grandChildC3, []],
    ];

    table.forEach(([target, expected]) => {
      assertEquals([...getFollows(target)], expected);
    });
  });
});

describe("next", () => {
  it("should", () => {
    const table: [Node, Node | null][] = [
      [root, parent],
      [parent, childA],
      [childA, grandChildA1],
      [grandChildA1, childB],
      [childB, grandChildB1],
      [grandChildB1, grandChildB2],
      [grandChildB2, childC],
      [childC, grandChildC1],
      [grandChildC1, grandChildC2],
      [grandChildC2, grandChildC3],
      [grandChildC3, null],
    ];

    table.forEach(([node, expected]) => {
      assertEquals(getFollow(node), expected);
    });
  });
});

describe("orderTree", () => {
  it("should yield depth first", () => {
    const table: [Node, Node[]][] = [
      [root, [
        root,
        parent,
        childA,
        grandChildA1,
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [parent, [
        parent,
        childA,
        grandChildA1,
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [childA, [
        childA,
        grandChildA1,
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildA1, [
        grandChildA1,
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [childB, [
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildB1, [
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildB2, [
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [childC, [
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildC1, [
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildC2, [
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildC3, [grandChildC3]],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...orderTree(node)], expected);
    });
  });
});

describe("orderSubtree", () => {
  it("should yield depth first", () => {
    const table: [Node, Node[]][] = [
      [parent, [
        parent,
        childA,
        grandChildA1,
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [childA, [
        childA,
        grandChildA1,
      ]],
      [grandChildA1, [grandChildA1]],
      [childB, [
        childB,
        grandChildB1,
        grandChildB2,
      ]],
      [grandChildB1, [grandChildB1]],
      [grandChildB2, [grandChildB2]],
      [childC, [
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [grandChildC1, [grandChildC1]],
      [grandChildC2, [grandChildC2]],
      [grandChildC3, [grandChildC3]],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...orderSubtree(node)], expected);
    });
  });
});

describe("getIndex", () => {
  it("should", () => {
    const table: [Node, number][] = [
      [root, 0],
      [parent, 0],
      [childA, 0],
      [childB, 1],
      [childC, 2],
      [grandChildA1, 0],
      [grandChildB1, 0],
      [grandChildB2, 1],
      [other, 0],
    ];

    table.forEach(([node, expected]) => {
      assertEquals(getIndex(node), expected);
    });
  });
});

describe("getDescendants", () => {
  it("should", () => {
    const table: [Node, Node[]][] = [
      [parent, [
        childA,
        grandChildA1,
        childB,
        grandChildB1,
        grandChildB2,
        childC,
        grandChildC1,
        grandChildC2,
        grandChildC3,
      ]],
      [childA, [grandChildA1]],
      [childB, [grandChildB1, grandChildB2]],
      [childC, [grandChildC1, grandChildC2, grandChildC3]],
      [grandChildA1, []],
      [grandChildB1, []],
      [grandChildB2, []],
      [grandChildC3, []],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...getDescendants(node)], expected);
    });
  });
});

describe("getFollow", () => {
  it("should return follow node", () => {
    const table: [Node, Node | null][] = [
      [root, parent],
      [parent, childA],
      [childA, grandChildA1],
      [grandChildA1, childB],
      [childB, grandChildB1],
      [grandChildB1, grandChildB2],
      [grandChildB2, childC],
      [childC, grandChildC1],
      [grandChildC1, grandChildC2],
      [grandChildC2, grandChildC3],
      [grandChildC3, null],
    ];

    table.forEach(([tree, expected]) => {
      assertEquals(getFollow(tree), expected);
    });
  });
});

describe("getInclusiveAncestors", () => {
  it("should yield inclusive ancestors", () => {
    const table: [Node, Node[]][] = [
      [root, [root]],
      [parent, [parent, root]],
      [childA, [childA, parent, root]],
      [grandChildA1, [grandChildA1, childA, parent, root]],
      [childB, [childB, parent, root]],
      [grandChildB1, [grandChildB1, childB, parent, root]],
      [grandChildB2, [grandChildB2, childB, parent, root]],
    ];

    table.forEach(([tree, expected]) => {
      assertEquals([...getInclusiveAncestors(tree)], expected);
    });
  });
});
