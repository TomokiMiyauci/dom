// deno-lint-ignore-file no-empty-interface
import { Constructor, first } from "../deps.ts";
import { find, ifilter } from "../deps.ts";
import { isElement } from "../dom/nodes/utils.ts";
import { Document_Obsolete } from "./obsolete.ts";
import { getDocumentElement } from "../dom/nodes/node_trees/node_tree.ts";
import { getChildTextContent } from "../dom/nodes/text.ts";
import { stripAndCollapseASCIIWhitespace } from "../infra/string.ts";
import { Namespace } from "../infra/namespace.ts";
import { $, tree } from "../internal.ts";

type PartialDocument =
  // [resource metadata management](https://html.spec.whatwg.org/multipage/dom.html#resource-metadata-management)
  | "location"
  | "domain"
  | "referrer"
  | "cookie"
  | "lastModified"
  | "readyState"
  // [DOM tree accessors](https://html.spec.whatwg.org/multipage/dom.html#dom-tree-accessors)
  | "title"
  | "dir"
  | "body"
  | "head"
  | "images"
  | "embeds"
  | "plugins"
  | "links"
  | "forms"
  | "scripts"
  | "getElementsByName"
  | "currentScript"
  // [dynamic markup insertion](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dynamic-markup-insertion)
  | "open"
  | "close"
  | "write"
  | "writeln"
  // [user interaction](https://html.spec.whatwg.org/multipage/interaction.html#editing)
  | "defaultView"
  | "hasFocus"
  | "designMode"
  | "execCommand"
  | "queryCommandEnabled"
  | "queryCommandIndeterm"
  | "queryCommandState"
  | "queryCommandSupported"
  | "queryCommandValue"
  | "hidden"
  | "visibilityState"
  // special [event handler IDL attributes](https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-idl-attributes) that only apply to Document objects;
  | "onreadystatechange"
  | "onvisibilitychange";

interface IDocument_HTML extends Pick<Document, PartialDocument> {}

export function Document_HTML<T extends Constructor<Node>>(
  Ctor: T,
) {
  @Document_Obsolete
  abstract class Mixin extends Ctor implements IDocument_HTML {
    /**
     * @see https://momdo.github.io/html/dom.html#current-document-readiness
     */
    _currentDocumentReadiness: DocumentReadyState = "complete";

    get location(): Location {
      throw new Error("location#getter");
    }
    set location(href: Location) {
      throw new Error("location#setter");
    }

    get domain(): string {
      throw new Error("domain#getter");
    }

    set domain(value: string) {
      throw new Error("domain#setter");
    }

    get referrer(): string {
      throw new Error("referrer");
    }

    get cookie(): string {
      throw new Error("cookie#getter");
    }

    set cookie(value: string) {
      throw new Error("cookie#setter");
    }

    get lastModified(): string {
      throw new Error("lastModified");
    }

    /**
     * @see https://momdo.github.io/html/dom.html#dom-document-readystate
     */
    get readyState(): DocumentReadyState {
      // to return this's current document readiness.
      return this._currentDocumentReadiness;
    }

    /**
     * @see https://html.spec.whatwg.org/multipage/dom.html#document.title
     */
    get title(): string {
      const documentElement = getDocumentElement(this);

      if (!documentElement) return "";

      const maybeTitle = $(documentElement).localName === "svg"
        // 1. If the document element is an SVG svg element, then let value be the child text content of the first SVG title element that is a child of the document element.
        ? first(
          ifilter(
            ifilter(tree.children(documentElement), isElement),
            isSVGTitle,
          ),
        )
        // 2. Otherwise, let value be the child text content of the title element, or the empty string if the title element is null.
        : getTitleElement(this);
      const value = maybeTitle ? getChildTextContent(maybeTitle) : "";

      // 3. Strip and collapse ASCII whitespace in value. 4. Return value.
      return stripAndCollapseASCIIWhitespace(value);
    }

    set title(value: string) {
      throw new Error("title#setter");
    }

    get dir(): string {
      throw new Error("dir#getter");
    }

    set dir(value: string) {
      throw new Error("dir#setter");
    }

    get body(): HTMLElement {
      // The body element of a document is the first of the html element's children that is either a body element or a frameset element, or null if there is no such element.
      const documentElement = find(tree.children(this), isElement) as
        | globalThis.Element
        | undefined;

      if (!documentElement) return null as any;

      if ($(documentElement).localName !== "html") return null as any;

      const bodyOrFrameSet =
        find(tree.children(documentElement), isBodyOrFrameset) ?? null;

      return bodyOrFrameSet as any as HTMLElement;
    }

    set body(value: HTMLElement) {
      throw new Error("body#setter");
    }

    /**
     * @see https://html.spec.whatwg.org/multipage/dom.html#dom-document-head
     * @note The specification also allows null to be returned.
     */
    get head(): HTMLHeadElement {
      // return the head element of the document (a head element or null).
      const elements = ifilter(tree.children(this), isElement);
      const head = find(
        elements,
        (element) => $(element).localName === "html",
      );

      return (head ?? null) as any as HTMLHeadElement;
    }

    get images(): HTMLCollectionOf<HTMLImageElement> {
      throw new Error("images");
    }

    get embeds(): HTMLCollectionOf<HTMLEmbedElement> {
      throw new Error();
    }

    get plugins(): HTMLCollectionOf<HTMLEmbedElement> {
      throw new Error();
    }

    get links(): HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement> {
      throw new Error();
    }

    get forms(): HTMLCollectionOf<HTMLFormElement> {
      throw new Error();
    }

    get scripts(): HTMLCollectionOf<HTMLScriptElement> {
      throw new Error();
    }

    getElementsByName(elementName: string): NodeListOf<HTMLElement> {
      throw new Error("getElementsByName");
    }

    get currentScript(): HTMLOrSVGScriptElement | null {
      throw new Error("currentScript");
    }

    open(
      unused1?: string | undefined,
      unused2?: string | undefined,
    ): globalThis.Document;
    open(url: string | URL, name: string, features: string): Window | null;
    open(
      url?: unknown,
      name?: unknown,
      features?: unknown,
    ): globalThis.Document | Window | null {
      throw new Error();
    }

    close(): void {
      throw new Error();
    }

    write(...text: string[]): void {
      throw new Error();
    }

    writeln(...text: string[]): void {
      throw new Error();
    }

    /**
     * @see https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-document-defaultview
     */
    get defaultView(): (WindowProxy & typeof globalThis) | null {
      // TODO
      return globalThis as any;
      // 1. If this's browsing context is null, then return null.

      // 2. Return this's browsing context's WindowProxy object.
    }

    hasFocus(): boolean {
      throw new Error("hasFocus");
    }

    get designMode(): string {
      throw new Error("designMode#getter");
    }

    set designMode(value: string) {
      throw new Error("designMode#setter");
    }

    execCommand(
      commandId: string,
      showUI?: boolean | undefined,
      value?: string | undefined,
    ): boolean {
      throw new Error("execCommand");
    }

    queryCommandEnabled(commandId: string): boolean {
      throw new Error();
    }

    queryCommandIndeterm(commandId: string): boolean {
      throw new Error();
    }

    queryCommandState(commandId: string): boolean {
      throw new Error();
    }

    queryCommandSupported(commandId: string): boolean {
      throw new Error();
    }

    queryCommandValue(commandId: string): string {
      throw new Error();
    }

    get hidden(): boolean {
      throw new Error();
    }

    get visibilityState(): DocumentVisibilityState {
      throw new Error();
    }

    onreadystatechange: ((this: Document, ev: Event) => any) | null = null;

    onvisibilitychange: ((this: Document, ev: Event) => any) | null = null;
  }

  return Mixin;
}

export interface Document_HTML extends IDocument_HTML, Document_Obsolete {}

/**
 * @see https://html.spec.whatwg.org/multipage/dom.html#the-title-element-2
 */
export function getTitleElement(node: Node): Element | null {
  // the first title element in the document (in tree order), if there is one, or null otherwise.
  return first(ifilter(
    ifilter(tree.descendants(node), isElement),
    (element) => $(element).localName === "title",
  )) ?? null;
}

function isSVGTitle(element: Element): boolean {
  return $(element).localName === "title" &&
    $(element).namespace === Namespace.SVG;
}

const tags = new Set<string>(["body", "frameset"]);

function isBodyOrFrameset(node: Node): boolean {
  if (!isElement(node)) return false;

  return tags.has($(node).localName);
}
