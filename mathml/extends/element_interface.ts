import { Document as _ } from "../../dom/nodes/documents/document.ts";
import { interfaceRegistry } from "../../dom/nodes/utils/create_element.ts";
import { resolveInterface } from "../element_interface.ts";
import { Namespace } from "../../infra/namespace.ts";

declare module "../../dom/nodes/documents/document.ts" {
  interface Document {
    createElementNS<K extends keyof MathMLElementTagNameMap>(
      namespaceURI: "http://www.w3.org/1998/Math/MathML",
      qualifiedName: K,
    ): MathMLElementTagNameMap[K];
    createElementNS(
      namespaceURI: "http://www.w3.org/1998/Math/MathML",
      qualifiedName: string,
    ): MathMLElement;
  }
}

interfaceRegistry.set(Namespace.MathML, resolveInterface);
