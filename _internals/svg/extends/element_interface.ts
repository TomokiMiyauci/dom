import "../../../nodes/document.ts";
import "../../../nodes/element.ts";
import { interfaceRegistry } from "../../../nodes/utils/create_element.ts";
import { resolveInterface } from "../element_interface.ts";
import { Namespace } from "../../infra/namespace.ts";

declare module "../../../nodes/document.ts" {
  interface Document {
    createElementNS<K extends keyof SVGElementTagNameMap>(
      namespaceURI: "http://www.w3.org/2000/svg",
      qualifiedName: K,
    ): SVGElementTagNameMap[K];
    createElementNS(
      namespaceURI: "http://www.w3.org/2000/svg",
      qualifiedName: string,
    ): SVGElement;

    getElementsByTagName<K extends keyof SVGElementTagNameMap>(
      qualifiedName: K,
    ): HTMLCollectionOf<SVGElementTagNameMap[K]>;

    getElementsByTagNameNS(
      namespaceURI: "http://www.w3.org/2000/svg",
      localName: string,
    ): HTMLCollectionOf<SVGElement>;
  }
}

declare module "../../../nodes/element.ts" {
  interface Element {
    getElementsByTagName<K extends keyof SVGElementTagNameMap>(
      qualifiedName: K,
    ): HTMLCollectionOf<SVGElementTagNameMap[K]>;

    getElementsByTagNameNS(
      namespaceURI: "http://www.w3.org/2000/svg",
      localName: string,
    ): HTMLCollectionOf<SVGElement>;

    closest<K extends keyof SVGElementTagNameMap>(
      selector: K,
    ): SVGElementTagNameMap[K] | null;
  }
}

interfaceRegistry.set(Namespace.SVG, resolveInterface);
