import { Text } from "../text.ts";
import { replaceAllNode } from "./mutation.ts";
import { $ } from "../../internal.ts";
import { data } from "../../symbol.ts";

/**
 * @see https://dom.spec.whatwg.org/#string-replace-all
 */
export function replaceAllString(
  string: string,
  parent: Node,
): void {
  // 1. Let node be null.
  let node: Text | null = null;

  // 2. If string is not the empty string,
  if (string !== "") {
    node = new Text();
    // then set node to a new Text node whose data is string and node document is parent’s node document.
    node[data] = string, $(node).nodeDocument = $(parent).nodeDocument;
  }

  // 3. Replace all with node within parent.
  replaceAllNode(node, parent);
}
