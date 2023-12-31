import "../../../nodes/document.ts";
import "../../../nodes/element.ts";
import { interfaceRegistry } from "../../../nodes/utils/create_element.ts";
import { resolveInterface } from "../element_interface.ts";
import { Namespace } from "../../infra/namespace.ts";

declare module "../../../nodes/document.ts" {
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

declare module "../../../nodes/element.ts" {
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
