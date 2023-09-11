import { getRoot, isChildOf, isTree, Tree } from "../infra/tree.ts";
import { isNodeLike, isShadowRoot } from "./utils.ts";

/**
 * @see [DOM Living Standard](https://triple-underscore.github.io/DOM4-ja.html#concept-shadow-including-inclusive-ancestor)
 */
export function isShadowInclusiveAncestor(A: Tree, B: Tree): boolean {
  return A === B || isShadowIncludingDescendant(A, B);
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-shadow-including-descendant)
 */
export function isShadowIncludingDescendant(A: Tree, B: Tree): boolean {
  if (isChildOf(A, B)) return true;

  const root = getRoot(A);

  return isNodeLike(root) && isShadowRoot(root) &&
    isShadowInclusiveAncestor(root["_host"], B);
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#retarget)
 */
export function retarget<T extends object | null>(
  A: T,
  B: object,
): T {
  while (true) {
    if (!A || !isTree(A) || !isNodeLike(A)) return A;

    const root = getRoot(A);

    if (
      !isShadowRoot(root) ||
      (isTree(B) && isNodeLike(B) && isShadowInclusiveAncestor(root, B))
    ) return A;

    A = root["_host"] as T;
  }
}
