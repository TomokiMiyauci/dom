import "../../../dom/nodes/documents/document.ts";
import "../../../dom/nodes/elements/element.ts";
import { interfaceRegistry } from "../../../dom/nodes/utils/create_element.ts";
import { resolveInterface } from "../element_interface.ts";
import { Namespace } from "../../infra/namespace.ts";

declare module "../../../dom/nodes/documents/document.ts" {
  interface Document {
    createElementNS<K extends keyof MathMLElementTagNameMap>(
      namespaceURI: "http://www.w3.org/1998/Math/MathML",
      qualifiedName: K,
    ): MathMLElementTagNameMap[K];
    createElementNS(
      namespaceURI: "http://www.w3.org/1998/Math/MathML",
      qualifiedName: string,
    ): MathMLElement;

    getElementsByTagName<K extends keyof MathMLElementTagNameMap>(
      qualifiedName: K,
    ): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
    getElementsByTagNameNS(
      namespaceURI: "http://www.w3.org/1998/Math/MathML",
      localName: string,
    ): HTMLCollectionOf<MathMLElement>;
  }
}

declare module "../../../dom/nodes/elements/element.ts" {
  interface Element {
    getElementsByTagName<K extends keyof MathMLElementTagNameMap>(
      qualifiedName: K,
    ): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
    getElementsByTagNameNS(
      namespaceURI: "http://www.w3.org/1998/Math/MathML",
      localName: string,
    ): HTMLCollectionOf<MathMLElement>;

    closest<K extends keyof MathMLElementTagNameMap>(
      selector: K,
    ): MathMLElementTagNameMap[K] | null;
  }
}

interfaceRegistry.set(Namespace.MathML, resolveInterface);
