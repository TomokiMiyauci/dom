import { Element } from "./element.ts";
import { UnImplemented } from "./utils.ts";
import type { INonElementParentNode } from "../interface.d.ts";

export class NonElementParentNode implements INonElementParentNode {
  getElementById(elementId: string): any | null {
    throw new UnImplemented();
  }
}
