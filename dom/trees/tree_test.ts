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
const child = new Node();
const child2 = new Node();
const child3 = new Node();
const child4 = new Node();
const child5 = new Node();
const grandChild = new Node();
const grandChild_2 = new Node();
const grandChild2 = new Node();
const other = new Node();

root.appendChild(parent);
parent.appendChild(child);
parent.appendChild(child2);
parent.appendChild(child3);
parent.appendChild(child4);
parent.appendChild(child5);
child.appendChild(grandChild);
child.appendChild(grandChild_2);
child2.appendChild(grandChild2);

describe("isChildOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [child, parent],
      [grandChild, child],
    ];

    table.forEach(([target, of]) => {
      assert(isChildOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [parent, parent],
      [child, child],
      [grandChild, grandChild],
      [parent, child],
      [parent, grandChild],
      [child, grandChild],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isChildOf(target, of));
    });
  });
});

describe("isDescendantOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [child, parent],
      [grandChild, parent],
      [grandChild, child],
    ];

    table.forEach(([target, of]) => {
      assert(isDescendantOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [parent, parent],
      [child, child],
      [grandChild, grandChild],
      [parent, child],
      [parent, grandChild],
      [child, grandChild],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isDescendantOf(target, of));
    });
  });
});

describe("isAncestorOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [parent, child],
      [parent, grandChild],
      [child, grandChild],
    ];

    table.forEach(([target, of]) => {
      assert(isAncestorOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [parent, parent],
      [child, child],
      [grandChild, grandChild],
      [child, parent],
      [grandChild, parent],
      [grandChild, child],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isAncestorOf(target, of));
    });
  });
});

describe("isInclusiveDescendantOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [child, parent],
      [grandChild, parent],
      [grandChild, child],
      [parent, parent],
      [child, child],
      [grandChild, grandChild],
    ];

    table.forEach(([target, of]) => {
      assert(isInclusiveDescendantOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [parent, child],
      [parent, grandChild],
      [child, grandChild],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isInclusiveDescendantOf(target, of));
    });
  });
});

describe("isInclusiveAncestorOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [parent, parent],
      [child, child],
      [grandChild, grandChild],
      [parent, child],
      [parent, grandChild],
      [child, grandChild],
    ];

    table.forEach(([target, of]) => {
      assert(isInclusiveAncestorOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [child, parent],
      [grandChild, parent],
      [grandChild, child],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isInclusiveAncestorOf(target, of));
    });
  });
});

describe("isSiblingOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [child, child2],
      [child2, child],
      [parent, parent],
      [child, child],
      [child2, child2],
      [grandChild, grandChild],
    ];

    table.forEach(([target, of]) => {
      assert(isSiblingOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [parent, child],
      [parent, child2],
      [parent, grandChild],
      [child, parent],
      [child, grandChild],
      [grandChild, parent],
      [grandChild, child],
      [grandChild, child2],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isSiblingOf(target, of));
    });
  });
});

describe("isPrecedeOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [parent, child],
      [parent, child2],
      [parent, child3],
      [parent, child4],
      [parent, child5],
      [child, child2],
      [child, child2],
      [child, child3],
      [child, child4],
      [child, child5],
      [child2, child3],
      [child2, child4],
      [child2, child5],
      [child3, child4],
      [child3, child5],
      [child4, child5],
      [grandChild, grandChild_2],
      [grandChild, grandChild2],
      [grandChild, child2],
      [grandChild, child3],
      [grandChild, child4],
      [grandChild, child5],
      [grandChild_2, grandChild2],
      [grandChild_2, child2],
      [grandChild_2, child3],
      [grandChild_2, child4],
      [grandChild_2, child5],
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
      [child, root],
      [child, parent],
      [child, child],
      [child2, root],
      [child2, parent],
      [child2, child],
      [child2, child2],
      [child3, root],
      [child3, parent],
      [child3, child],
      [child3, grandChild],
      [child3, grandChild_2],
      [child3, child2],
      [child3, grandChild2],
      [grandChild, root],
      [grandChild, parent],
      [grandChild, child],
      [grandChild, grandChild],
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
      [child, root],
      [child, parent],
      [child2, root],
      [child2, parent],
      [child2, child],
      [child3, root],
      [child3, parent],
      [child3, child],
      [child3, grandChild],
      [child3, grandChild_2],
      [child3, child2],
      [child3, grandChild2],
      [grandChild, root],
      [grandChild, parent],
      [grandChild, child],
    ];

    table.forEach(([target, of]) => {
      assert(isFollowOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [parent, other],
      [parent, parent],
      [parent, child],
      [parent, child2],
      [parent, child3],
      [parent, child4],
      [parent, child5],
      [child, child],
      [child, child2],
      [child, child2],
      [child, child3],
      [child, child4],
      [child, child5],
      [child2, child2],
      [child2, child3],
      [child2, child4],
      [child2, child5],
      [child3, child4],
      [child3, child5],
      [child4, child5],
      [grandChild, grandChild_2],
      [grandChild, grandChild2],
      [grandChild, child2],
      [grandChild, child3],
      [grandChild, child4],
      [grandChild, child5],
      [grandChild_2, grandChild2],
      [grandChild_2, child2],
      [grandChild_2, child3],
      [grandChild_2, child4],
      [grandChild_2, child5],
      [grandChild, grandChild],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isFollowOf(target, of));
    });
  });
});

describe("isInclusiveSiblingOf", () => {
  it("should return true", () => {
    const table: [Node, Node][] = [
      [child, child2],
      [child2, child],
      [child, child],
      [child2, child2],
      [grandChild, grandChild],
      [parent, parent],
    ];

    table.forEach(([target, of]) => {
      assert(isInclusiveSiblingOf(target, of));
    });
  });

  it("should return false", () => {
    const table: [Node, Node][] = [
      [parent, child],
      [parent, child2],
      [parent, grandChild],
      [child, parent],
      [child, grandChild],
      [grandChild, parent],
      [grandChild, child],
      [grandChild, child2],
    ];

    table.forEach(([target, of]) => {
      assertFalse(isInclusiveSiblingOf(target, of));
    });
  });
});

describe("getRoot", () => {
  it("should return root node", () => {
    const table: Node[] = [root, parent, child, child2, grandChild];

    table.forEach((target) => {
      assert(getRoot(target) === root);
    });
  });
});

describe("getSiblings", () => {
  it("should return siblings", () => {
    const table: [Node, Node[]][] = [
      [child, [child, child2, child3, child4, child5]],
      [child2, [child, child2, child3, child4, child5]],
      [parent, [parent]],
      [grandChild, [grandChild, grandChild_2]],
      [root, []],
    ];

    table.forEach(([target, expected]) => {
      assertEquals([...getSiblings(target)], expected);
    });
  });
});

describe("getPrecedingSiblings", () => {
  it("should return preceding siblings", () => {
    const table: [Node, Node[]][] = [
      [child, []],
      [child2, [child]],
      [child3, [child2, child]],
      [child4, [child3, child2, child]],
      [child5, [child4, child3, child2, child]],
      [parent, []],
      [grandChild, []],
      [root, []],
    ];

    table.forEach(([target, expected]) => {
      assertEquals([...getPrecedingSiblings(target)], expected);
    });
  });
});

describe("getPreviousSibling", () => {
  it("should return previous sibling", () => {
    const table: [Node, Node | null][] = [
      [child, null],
      [child2, child],
      [child3, child2],
      [child4, child3],
      [child5, child4],
      [root, null],
      [parent, null],
      [grandChild, null],
    ];

    table.forEach(([target, expected]) => {
      assertEquals(getPreviousSibling(target), expected);
    });
  });
});

describe("getFollowingSiblings", () => {
  it("should return following siblings", () => {
    const table: [Node, Node[]][] = [
      [child, [child2, child3, child4, child5]],
      [child2, [child3, child4, child5]],
      [child3, [child4, child5]],
      [child4, [child5]],
      [child5, []],
      [root, []],
      [parent, []],
      [grandChild, [grandChild_2]],
    ];

    table.forEach(([target, expected]) => {
      assertEquals([...getFollowingSiblings(target)], expected);
    });
  });
});

describe("getNextSibling", () => {
  it("should return next sibling", () => {
    const table: [Node, Node | null][] = [
      [child, child2],
      [child2, child3],
      [child3, child4],
      [child4, child5],
      [child5, null],
      [root, null],
      [parent, null],
      [grandChild, grandChild_2],
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
      [child, [root, parent]],
      [grandChild, [root, parent, child]],
      [grandChild_2, [root, parent, child, grandChild]],
      [child2, [root, parent, child, grandChild, grandChild_2]],
      [grandChild2, [root, parent, child, grandChild, grandChild_2, child2]],
      [child3, [
        root,
        parent,
        child,
        grandChild,
        grandChild_2,
        child2,
        grandChild2,
      ]],
      [child4, [
        root,
        parent,
        child,
        grandChild,
        grandChild_2,
        child2,
        grandChild2,
        child3,
      ]],
      [child5, [
        root,
        parent,
        child,
        grandChild,
        grandChild_2,
        child2,
        grandChild2,
        child3,
        child4,
      ]],
    ];

    table.forEach(([target, expected]) => {
      assertEquals([...getPrecedings(target)], expected);
    });
  });
});

describe("orderTree", () => {
  it("should yield depth first", () => {
    const table: [Node, Node[]][] = [
      [root, [
        root,
        parent,
        child,
        grandChild,
        grandChild_2,
        child2,
        grandChild2,
        child3,
        child4,
        child5,
      ]],
      [parent, [
        parent,
        child,
        grandChild,
        grandChild_2,
        child2,
        grandChild2,
        child3,
        child4,
        child5,
      ]],
      [child, [child, grandChild, grandChild_2]],
      [child2, [child2, grandChild2]],
      [child3, [child3]],
      [child4, [child4]],
      [child5, [child5]],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...orderTree(node)], expected);
    });
  });
});

describe("getFollows", () => {
  it("should return following nodes", () => {
    const table: [Node, Node[]][] = [
      [root, [
        parent,
        child,
        grandChild,
        grandChild_2,
        child2,
        grandChild2,
        child3,
        child4,
        child5,
      ]],
      [child, [
        grandChild,
        grandChild_2,
        child2,
        grandChild2,
        child3,
        child4,
        child5,
      ]],
      [child2, [grandChild2, child3, child4, child5]],
      [child3, [
        child4,
        child5,
      ]],
      [child4, [child5]],
      [child5, []],
    ];

    table.forEach(([target, expected]) => {
      assertEquals([...getFollows(target)], expected);
    });
  });
});

describe("getIndex", () => {
  it("should", () => {
    const table: [Node, number][] = [
      [parent, 0],
      [child, 0],
      [child2, 1],
      [child2, 1],
      [child3, 2],
      [child4, 3],
      [child5, 4],
      [grandChild, 0],
      [grandChild_2, 1],
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
        child,
        grandChild,
        grandChild_2,
        child2,
        grandChild2,
        child3,
        child4,
        child5,
      ]],
      [child, [grandChild, grandChild_2]],
      [child2, [grandChild2]],
      [child3, []],
      [child4, []],
      [child5, []],
    ];

    table.forEach(([node, expected]) => {
      assertEquals([...getDescendants(node)], expected);
    });
  });
});

describe("orderTreeChildren", () => {
  it("should", () => {
    const table: [Node, Node[]][] = [
      [parent, [
        child,
        grandChild,
        grandChild_2,
        child2,
        grandChild2,
        child3,
        child4,
        child5,
      ]],
      [child, [grandChild, grandChild_2]],
      [child2, [grandChild2]],
      [child3, []],
      [child4, []],
      [child5, []],
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
      [parent, child],
      [child, grandChild],
      [grandChild, grandChild_2],
      [grandChild_2, child2],
      [child2, grandChild2],
      [grandChild2, child3],
      [child3, child4],
      [child4, child5],
      [child5, null],
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
      [child, [child, parent, root]],
      [grandChild, [grandChild, child, parent, root]],
      [grandChild_2, [grandChild_2, child, parent, root]],
      [child2, [child2, parent, root]],
      [grandChild2, [grandChild2, child2, parent, root]],
    ];

    table.forEach(([tree, expected]) => {
      assertEquals([...getInclusiveAncestors(tree)], expected);
    });
  });
});
