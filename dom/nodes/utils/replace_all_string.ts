import { Text } from "../text.ts";
import { replaceAllNode } from "../node_trees/mutation.ts";
import { $ } from "../../../internal.ts";

/**
 * @see https://dom.spec.whatwg.org/#string-replace-all
 */
export function replaceAllString(
  string: string,
  parent: Node,
): void {
  // 1. Let node be null.
  let node: Node | null = null;

  // 2. If string is not the empty string, then set node to a new Text node whose data is string and node document is parent’s node document.
  if (string !== "") {
    node = Text["create"]({
      data: string,
      nodeDocument: $(parent).nodeDocument,
    });
  }

  // 3. Replace all with node within parent.
  replaceAllNode(node, parent);
}
