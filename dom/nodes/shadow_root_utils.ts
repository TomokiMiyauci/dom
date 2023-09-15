import { $, tree } from "../../internal.ts";
import { isNodeLike, isShadowRoot } from "./utils.ts";

/**
 * @see [DOM Living Standard](https://triple-underscore.github.io/DOM4-ja.html#concept-shadow-including-inclusive-ancestor)
 */
export function isShadowInclusiveAncestor(A: Node, B: unknown): boolean {
  return A === B || isShadowIncludingDescendant(A, B);
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-shadow-including-descendant)
 */
export function isShadowIncludingDescendant(A: Node, B: unknown): boolean {
  if (tree.isChild(A, B)) return true;

  const root = tree.root(A);

  return isNodeLike(root) && isShadowRoot(root) &&
    isShadowInclusiveAncestor($(root).host, B);
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

    const root = tree.root(A as Node);

    if (
      !isShadowRoot(root) ||
      (isNodeLike(B) && isShadowInclusiveAncestor(root, B))
    ) return A;

    A = $(root).host as T;
  }
}
