import "../../../nodes/document.ts";
import "../../../nodes/element.ts";
import { interfaceRegistry } from "../../../nodes/utils/create_element.ts";
import { resolveInterface } from "../dom/element_interface.ts";
import { Namespace } from "../../infra/namespace.ts";

declare module "../../../nodes/document.ts" {
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

    getElementsByTagName<K extends keyof HTMLElementTagNameMap>(
      qualifiedName: K,
    ): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
    getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(
      qualifiedName: K,
    ): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;

    getElementsByTagNameNS(
      namespaceURI: "http://www.w3.org/1999/xhtml",
      localName: string,
    ): HTMLCollectionOf<HTMLElement>;
  }
}

declare module "../../../nodes/element.ts" {
  interface Element {
    getElementsByTagNameNS(
      namespaceURI: "http://www.w3.org/1999/xhtml",
      localName: string,
    ): HTMLCollectionOf<HTMLElement>;

    getElementsByTagName<K extends keyof HTMLElementTagNameMap>(
      qualifiedName: K,
    ): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
    getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(
      qualifiedName: K,
    ): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;

    closest<K extends keyof HTMLElementTagNameMap>(
      selector: K,
    ): HTMLElementTagNameMap[K] | null;
  }
}

interfaceRegistry.set(Namespace.HTML, resolveInterface);
