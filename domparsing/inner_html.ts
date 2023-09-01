import { type Constructor } from "../deps.ts";
import type { IInnerHTML } from "../interface.d.ts";
import { replaceAllNode } from "../dom/nodes/mutation.ts";
import { type Element } from "../dom/nodes/element.ts";
import { convert, DOMString } from "../webidl/types.ts";
import { parseFragment, serializeFragment } from "./fragment.ts";

export function InnerHTML<T extends Constructor<Element>>(
  Ctor: T,
) {
  /**
   * @see https://w3c.github.io/DOM-Parsing/#dom-innerhtml
   */
  abstract class InnerHTML extends Ctor implements IInnerHTML {
    override get innerHTML(): string {
      return serializeFragment(this, true);
    }

    /**
     * @see https://w3c.github.io/DOM-Parsing/#dom-innerhtml-innerhtml
     */
    @convert
    override set innerHTML(@DOMString value: string) {
      // 1. Let context element be the context object's host if the context object is a ShadowRoot object, or the context object otherwise.
      // TODO(miyauci): Treat shadow host
      const contextElement = this;

      // 2. Let fragment be the result of invoking the fragment parsing algorithm with the new value as markup, and with context element.
      const fragment = parseFragment(value, contextElement);

      // 3. If the context object is a template element, then let context object be the template's template contents (a DocumentFragment).
      // TODO(miyauci): Treat shadow host
      const node = this;

      // 4. Replace all with fragment within the context object.
      replaceAllNode(fragment, node);
    }
  }

  return InnerHTML;
}

// deno-lint-ignore no-empty-interface
export interface InnerHTML extends IInnerHTML {}
