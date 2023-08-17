import { type INonDocumentTypeChildNode } from "../interface.d.ts";
import { UnImplemented } from "./utils.ts";
import type { Element } from "./element.ts";
import { type Constructor } from "../deps.ts";

export function NonDocumentTypeChildNode<T extends Constructor>(Ctor: T) {
  abstract class NonDocumentTypeChildNode extends Ctor
    implements INonDocumentTypeChildNode {
    get nextElementSibling(): Element | null {
      throw new UnImplemented("nextElementSibling");
    }

    set nextElementSibling(value: Element | null) {
      throw new UnImplemented("nextElementSibling");
    }

    get previousElementSibling(): Element | null {
      throw new UnImplemented("previousElementSibling");
    }

    set previousElementSibling(value: Element | null) {
      throw new UnImplemented("previousElementSibling");
    }
  }

  return NonDocumentTypeChildNode;
}

// deno-lint-ignore no-empty-interface
export interface NonDocumentTypeChildNode extends INonDocumentTypeChildNode {}
