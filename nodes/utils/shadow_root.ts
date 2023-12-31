import { Constructor } from "../../deps.ts";
import { tree } from "../../internal.ts";
import { Tree } from "../../infra/tree.ts";
import { isNodeLike } from "./type.ts";
import * as $$ from "../../symbol.ts";
import { isShadowRoot } from "./type.ts";
import { $Node } from "../../i.ts";

export function ShadowTree<T extends Constructor<Tree<$Node>>>(
  Ctor: T,
): T & Constructor<ShadowTree> {
  abstract class ShadowTree extends Ctor implements ShadowTree {
    shadowIncludingRoot(node: $Node): $Node {
      const root = this.root(node);

      // its root’s host’s shadow-including root, if the object’s root is a shadow root; otherwise its root.
      if (isShadowRoot(root)) {
        return this.shadowIncludingRoot(root[$$.host]);
      }

      return root;
    }

    *shadowIncludingDescendants(node: $Node): IterableIterator<$Node> {
      for (const descendant of this.descendants(node)) {
        const root = this.root(descendant);

        if (isShadowRoot(root)) {
          yield* this.shadowIncludingInclusiveDescendants(root[$$.host]);
        } else yield descendant;
      }
    }

    *shadowIncludingInclusiveDescendants(node: $Node): IterableIterator<$Node> {
      yield node;
      yield* this.shadowIncludingDescendants(node);
    }

    isShadowIncludingDescendant(A: $Node, B: $Node): boolean {
      if (this.isDescendant(A, B)) return true;

      const root = this.root(A);

      return isShadowRoot(root) &&
        this.isShadowIncludingInclusiveDescendant(root[$$.host], B);
    }

    isShadowIncludingInclusiveDescendant(A: $Node, B: $Node): boolean {
      return A === B || this.isShadowIncludingDescendant(A, B);
    }

    isShadowIncludingAncestor(A: $Node, B: $Node): boolean {
      return this.isShadowIncludingDescendant(B, A);
    }

    isShadowIncludingInclusiveAncestor(A: $Node, B: $Node): boolean {
      return A === B || this.isShadowIncludingAncestor(A, B);
    }
  }

  return ShadowTree;
}

export interface ShadowTree {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-shadow-including-root)
   */
  shadowIncludingRoot(node: $Node): $Node;

  shadowIncludingDescendants(node: $Node): IterableIterator<$Node>;

  shadowIncludingInclusiveDescendants(node: $Node): IterableIterator<$Node>;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-shadow-including-descendant)
   */
  isShadowIncludingDescendant(A: $Node, B: $Node): boolean;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-shadow-including-inclusive-descendant)
   */
  isShadowIncludingInclusiveDescendant(A: $Node, B: $Node): boolean;

  isShadowIncludingAncestor(A: object, B: object): boolean;

  isShadowIncludingInclusiveAncestor(A: object, B: object): boolean;
}

/**
 * @see [DOM Living Standard](https://triple-underscore.github.io/DOM4-ja.html#concept-shadow-including-inclusive-ancestor)
 */
export function isShadowInclusiveAncestor(A: $Node, B: unknown): boolean {
  return A === B || isShadowIncludingDescendant(A, B);
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-shadow-including-descendant)
 */
export function isShadowIncludingDescendant(A: $Node, B: unknown): boolean {
  if (tree.isChild(A, B)) return true;

  const root = tree.root(A);

  return isNodeLike(root) && isShadowRoot(root) &&
    isShadowInclusiveAncestor(root[$$.host], B);
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#retarget)
 */
export function retarget<T extends object | null>(
  A: T,
  B: object,
): T {
  while (true) {
    if (!A || !isNodeLike(A)) return A;

    const root = tree.root(A as $Node);

    if (
      !isShadowRoot(root) ||
      (isNodeLike(B) && isShadowInclusiveAncestor(root, B))
    ) return A;

    A = root[$$.host] as T;
  }
}
