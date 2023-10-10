import { Document as _ } from "../../dom/nodes/documents/document.ts";
import { interfaceRegistry } from "../../dom/nodes/utils/create_element.ts";
import { resolveInterface } from "../dom/element_interface.ts";
import { Namespace } from "../../infra/namespace.ts";

declare module "../../dom/nodes/documents/document.ts" {
  interface Document {
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions,
    ): HTMLElementTagNameMap[K];
    createElement<K extends keyof HTMLElementDeprecatedTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions,
    ): HTMLElementDeprecatedTagNameMap[K];
    createElement(
      tagName: string,
      options?: ElementCreationOptions,
    ): HTMLElement;

    createElementNS(
      namespaceURI: "http://www.w3.org/1999/xhtml",
      qualifiedName: string,
    ): HTMLElement;
  }
}

interfaceRegistry.set(Namespace.HTML, resolveInterface);
