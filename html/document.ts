// deno-lint-ignore-file no-empty-interface
import { Constructor, iter } from "../deps.ts";
import { isElement } from "../dom/nodes/utils.ts";
import { Document_Obsolete } from "./obsolete.ts";
import { getDocumentElement } from "../dom/nodes/node_trees/node_tree.ts";
import { stripAndCollapseASCIIWhitespace } from "../infra/string.ts";
import { Namespace } from "../infra/namespace.ts";
import { $ } from "./internal.ts";
import * as DOM from "../internal.ts";
import { tree } from "../internal.ts";
import { type BrowsingContext } from "./loading_web_pages/infrastructure_for_sequences_of_documents/browsing_context.ts";
import {
  CrossOriginOpenerPolicy,
  PolicyContainer,
} from "./loading_web_pages/supporting_concepts.ts";
import { OrderedSet } from "../infra/data_structures/set.ts";
import { SameObject } from "../webidl/extended_attribute.ts";
import { HTMLCollection } from "../dom/nodes/node_trees/html_collection.ts";
import { isHTMLScriptElement } from "./elements/scripting/html_script_element_utils.ts";

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

export function Document_HTML<T extends Constructor<Document>>(
  Ctor: T,
) {
  @Document_Obsolete
  abstract class Mixin extends Ctor implements IDocument_HTML {
    /**
     * @see https://momdo.github.io/html/dom.html#current-document-readiness
     */
    _currentDocumentReadiness: DocumentReadyState = "complete";

    /**
     * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-document-location)
     */
    override get location(): Location {
      // return this's relevant global object's Location object, if this is fully active, and null otherwise.
      // TODO
      return null!;
    }

    override get domain(): string {
      throw new Error("domain#getter");
    }

    override set domain(value: string) {
      throw new Error("domain#setter");
    }

    override get referrer(): string {
      throw new Error("referrer");
    }

    override get cookie(): string {
      throw new Error("cookie#getter");
    }

    override set cookie(value: string) {
      throw new Error("cookie#setter");
    }

    override get lastModified(): string {
      throw new Error("lastModified");
    }

    /**
     * @see https://momdo.github.io/html/dom.html#dom-document-readystate
     */
    override get readyState(): DocumentReadyState {
      // to return this's current document readiness.
      return this._currentDocumentReadiness;
    }

    /**
     * @see https://html.spec.whatwg.org/multipage/dom.html#document.title
     */
    override get title(): string {
      const documentElement = getDocumentElement(this);

      if (!documentElement) return "";

      const maybeTitle = DOM.$(documentElement).localName === "svg"
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

    override set title(value: string) {
      throw new Error("title#setter");
    }

    override get dir(): string {
      throw new Error("dir#getter");
    }

    override set dir(value: string) {
      throw new Error("dir#setter");
    }

    override get body(): HTMLElement {
      const children = tree.children(this);
      // The body element of a document is the first of the html element's children that is either a body element or a frameset element, or null if there is no such element.
      const documentElement = iter(children).find(isElement);

      if (!documentElement) return null as any;

      if (DOM.$(documentElement).localName !== "html") return null as any;

      const documentElementChildren = tree.children(documentElement);
      const bodyOrFrameSet = iter(documentElementChildren)
        .find(isBodyOrFrameset);

      return (bodyOrFrameSet ?? null) as any as HTMLElement;
    }

    override set body(value: HTMLElement) {
      throw new Error("body#setter");
    }

    /**
     * @see https://html.spec.whatwg.org/multipage/dom.html#dom-document-head
     * @note The specification also allows null to be returned.
     */
    override get head(): HTMLHeadElement {
      const children = tree.children(this);
      // return the head element of the document (a head element or null).
      const head =
        iter(children).filter(isElement).find((element) =>
          DOM.$(element).localName === "html"
        ) ?? null;

      return head as HTMLHeadElement;
    }

    override get images(): HTMLCollectionOf<HTMLImageElement> {
      throw new Error("images");
    }

    override get embeds(): HTMLCollectionOf<HTMLEmbedElement> {
      throw new Error();
    }

    override get plugins(): HTMLCollectionOf<HTMLEmbedElement> {
      throw new Error();
    }

    override get links(): HTMLCollectionOf<
      HTMLAnchorElement | HTMLAreaElement
    > {
      throw new Error();
    }

    override get forms(): HTMLCollectionOf<HTMLFormElement> {
      throw new Error();
    }

    /**
     * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#dom-document-scripts)
     */
    @SameObject
    override get scripts(): HTMLCollectionOf<HTMLScriptElement> {
      // return an HTMLCollection rooted at the Document node, whose filter matches only script elements.
      return new HTMLCollection({
        root: this,
        filter: isHTMLScriptElement,
      }) as any as HTMLCollectionOf<HTMLScriptElement>;
    }

    override getElementsByName(elementName: string): NodeListOf<HTMLElement> {
      throw new Error("getElementsByName");
    }

    override get currentScript(): HTMLOrSVGScriptElement | null {
      throw new Error("currentScript");
    }

    override open(
      unused1?: string | undefined,
      unused2?: string | undefined,
    ): globalThis.Document;
    override open(
      url: string | URL,
      name: string,
      features: string,
    ): Window | null;
    override open(
      url?: unknown,
      name?: unknown,
      features?: unknown,
    ): globalThis.Document | Window | null {
      throw new Error();
    }

    override close(): void {
      throw new Error();
    }

    override write(...text: string[]): void {
      throw new Error();
    }

    override writeln(...text: string[]): void {
      throw new Error();
    }

    /**
     * @see https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-document-defaultview
     */
    override get defaultView(): (Window & typeof globalThis) | null {
      return globalThis as any;
      // const { browsingContext } = this.#_;
      // // 1. If this's browsing context is null, then return null.
      // if (!browsingContext) return null;

      // // 2. Return this's browsing context's WindowProxy object.
      // return browsingContext.WindowProxy as Window & typeof globalThis;
    }

    override hasFocus(): boolean {
      throw new Error("hasFocus");
    }

    override get designMode(): string {
      throw new Error("designMode#getter");
    }

    override set designMode(value: string) {
      throw new Error("designMode#setter");
    }

    override execCommand(
      commandId: string,
      showUI?: boolean | undefined,
      value?: string | undefined,
    ): boolean {
      throw new Error("execCommand");
    }

    override queryCommandEnabled(commandId: string): boolean {
      throw new Error();
    }

    override queryCommandIndeterm(commandId: string): boolean {
      throw new Error();
    }

    override queryCommandState(commandId: string): boolean {
      throw new Error();
    }

    override queryCommandSupported(commandId: string): boolean {
      throw new Error();
    }

    override queryCommandValue(commandId: string): string {
      throw new Error();
    }

    override get hidden(): boolean {
      throw new Error();
    }

    override get visibilityState(): DocumentVisibilityState {
      throw new Error();
    }

    override onreadystatechange: ((this: Document, ev: Event) => any) | null =
      null;

    override onvisibilitychange: ((this: Document, ev: Event) => any) | null =
      null;

    get #_() {
      return $<Document>(this);
    }
  }

  return Mixin;
}

export interface Document_HTML extends IDocument_HTML, Document_Obsolete {}

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
}

/**
 * @see https://html.spec.whatwg.org/multipage/dom.html#the-title-element-2
 */
export function getTitleElement(node: Node): Element | null {
  const descendant = tree.descendants(node);
  // the first title element in the document (in tree order), if there is one, or null otherwise.
  return iter(descendant)
    .filter(isElement)
    .find((element) => DOM.$(element).localName === "title") ??
    null;
}

function isSVGTitle(element: Element): boolean {
  return DOM.$(element).localName === "title" &&
    DOM.$(element).namespace === Namespace.SVG;
}

const tags = new Set<string>(["body", "frameset"]);

function isBodyOrFrameset(node: Node): boolean {
  if (!isElement(node)) return false;

  return tags.has(DOM.$(node).localName);
}
