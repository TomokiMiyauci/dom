import { iter } from "../../deps.ts";
import { isElement } from "../../nodes/utils/type.ts";
import { getDocumentElement } from "../../nodes/utils/node_tree.ts";
import { stripAndCollapseASCIIWhitespace } from "../infra/string.ts";
import { Namespace } from "../infra/namespace.ts";
import { $ } from "../../internal.ts";
import { tree } from "../../internal.ts";
import { type BrowsingContext } from "./loading_web_pages/infrastructure_for_sequences_of_documents/browsing_context.ts";
import {
  CrossOriginOpenerPolicy,
  PolicyContainer,
} from "./loading_web_pages/supporting_concepts.ts";
import { OrderedSet } from "../infra/data_structures/set.ts";
import { SameObject } from "../webidl/extended_attribute.ts";
import { HTMLCollection } from "../../nodes/html_collection.ts";
import { isHTMLScriptElement } from "./elements/scripting/html_script_element_utils.ts";
import { $Element } from "../../i.ts";
import * as $$ from "../../symbol.ts";

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

export interface IDocument_HTML extends Pick<Document, PartialDocument> {}

export class Document implements IDocument_HTML {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-document-location)
   */
  get location(): Location {
    // return this's relevant global object's Location object, if this is fully active, and null otherwise.
    // TODO
    return null!;
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
    return $<globalThis.Document>(this).currentDocumentReadiness;
  }

  /**
   * @see https://html.spec.whatwg.org/multipage/dom.html#document.title
   */
  get title(): string {
    const documentElement = getDocumentElement(this);

    if (!documentElement) return "";

    const maybeTitle = documentElement[$$.localName] === "svg"
      // 1. If the document element is an SVG svg element, then let value be the child text content of the first SVG title element that is a child of the document element.
      ? iter(tree.children(documentElement))
        .filter(isElement)
        .find(isSVGTitle)
      // 2. Otherwise, let value be the child text content of the title element, or the empty string if the title element is null.
      : getTitleElement(this);
    const value = maybeTitle ? tree.childTextContent(maybeTitle) : "";

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
    const children = tree.children(this);
    // The body element of a document is the first of the html element's children that is either a body element or a frameset element, or null if there is no such element.
    const documentElement = iter(children).find(isElement);

    if (!documentElement) return null as any;

    if (documentElement[$$.localName] !== "html") return null as any;

    const documentElementChildren = tree.children(documentElement);
    const bodyOrFrameSet = iter(documentElementChildren)
      .find(isBodyOrFrameset);

    return (bodyOrFrameSet ?? null) as any as HTMLElement;
  }

  set body(value: HTMLElement) {
    throw new Error("body#setter");
  }

  /**
   * @see https://html.spec.whatwg.org/multipage/dom.html#dom-document-head
   * @note The specification also allows null to be returned.
   */
  get head(): HTMLHeadElement {
    const children = tree.children(this);
    // return the head element of the document (a head element or null).
    const head =
      iter(children).filter(isElement).find((element) =>
        element[$$.localName] === "html"
      ) ?? null;

    return head as HTMLHeadElement;
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

  get links(): HTMLCollectionOf<
    HTMLAnchorElement | HTMLAreaElement
  > {
    throw new Error();
  }

  get forms(): HTMLCollectionOf<HTMLFormElement> {
    throw new Error();
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#dom-document-scripts)
   */
  @SameObject
  get scripts(): HTMLCollectionOf<HTMLScriptElement> {
    // return an HTMLCollection rooted at the Document node, whose filter matches only script elements.
    return new HTMLCollection({
      root: this,
      filter: isHTMLScriptElement,
    }) as any as HTMLCollectionOf<HTMLScriptElement>;
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
  open(
    url: string | URL,
    name: string,
    features: string,
  ): Window | null;
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
  get defaultView(): (Window & typeof globalThis) | null {
    return globalThis as any;
    // const { browsingContext } = this.#_;
    // // 1. If this's browsing context is null, then return null.
    // if (!browsingContext) return null;

    // // 2. Return this's browsing context's WindowProxy object.
    // return browsingContext.WindowProxy as Window & typeof globalThis;
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

  onreadystatechange: ((this: globalThis.Document, ev: Event) => any) | null =
    null;

  onvisibilitychange: ((this: globalThis.Document, ev: Event) => any) | null =
    null;
}

export interface Document extends globalThis.Document {}

export class DocumentInternals {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#concept-document-policy-container)
   */
  policyContainer: PolicyContainer = new PolicyContainer();

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#concept-document-permissions-policy)
   */
  permissionsPolicy: unknown;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#concept-document-coop)
   */
  crossOriginOpenerPolicy: CrossOriginOpenerPolicy =
    new CrossOriginOpenerPolicy();

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#is-initial-about:blank)
   */
  isInitialAboutBlank = false;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#concept-document-navigation-id)
   */
  duringLoadingNavigationIDForWebDriverBiDi: string | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#concept-document-about-base-url)
   */
  aboutBaseURL: URL | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-lifecycle.html#completely-loaded-time)
   */
  completelyLoadedTime: unknown | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#concept-document-bc)
   */
  browsingContext: BrowsingContext | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#iframe-load-in-progress)
   */
  iframeLoadInProgress = false;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#mute-iframe-load)
   */
  muteIframeLoad = false;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-lifecycle.html#concept-document-salvageable)
   */
  salvageable = true;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-lifecycle.html#unload-counter)
   */
  unloadCounter = 0;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#render-blocking-element-set)
   */
  renderBlockingElementSet: OrderedSet<Element> = new OrderedSet();

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#ignore-destructive-writes-counter)
   */
  ignoreDestructiveWritesCounter = 0;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#dom-document-currentscript)
   */
  currentScript: Element | null = null;

  /**
   * @see https://momdo.github.io/html/dom.html#current-document-readiness
   */
  currentDocumentReadiness: DocumentReadyState = "complete";
}

/**
 * @see https://html.spec.whatwg.org/multipage/dom.html#the-title-element-2
 */
export function getTitleElement(node: Node): Element | null {
  const descendant = tree.descendants(node);
  // the first title element in the document (in tree order), if there is one, or null otherwise.
  return iter(descendant)
    .filter(isElement)
    .find((element) => element[$$.localName] === "title") ??
    null;
}

function isSVGTitle(element: $Element): boolean {
  return element[$$.localName] === "title" &&
    element[$$.namespace] === Namespace.SVG;
}

const tags = new Set<string>(["body", "frameset"]);

function isBodyOrFrameset(node: Node): boolean {
  if (!isElement(node)) return false;

  return tags.has(node[$$.localName]);
}
