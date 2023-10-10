import { Document as _ } from "../../dom/nodes/documents/document.ts";
import { interfaceRegistry } from "../../dom/nodes/utils/create_element.ts";
import { resolveInterface } from "../element_interface.ts";
import { Namespace } from "../../infra/namespace.ts";

declare module "../../dom/nodes/documents/document.ts" {
  interface Document {
    createElementNS<K extends keyof SVGElementTagNameMap>(
      namespaceURI: "http://www.w3.org/2000/svg",
      qualifiedName: K,
    ): SVGElementTagNameMap[K];
    createElementNS(
      namespaceURI: "http://www.w3.org/2000/svg",
      qualifiedName: string,
    ): SVGElement;
  }
}

interfaceRegistry.set(Namespace.SVG, resolveInterface);
