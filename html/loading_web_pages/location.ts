import type { ILocation } from "../../interface.d.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";
import { stringifier } from "../../webidl/idl.ts";
import { browsingContext } from "./window_utils.ts";
import { $ } from "../internal.ts";
import * as DOM from "../../internal.ts";
import { activeDocument } from "./infrastructure_for_sequences_of_documents/browsing_context.ts";
import { URLSerializer } from "../../url/serializer.ts";
import { sameOriginDomain } from "./supporting_concepts.ts";
import { DOMExceptionName } from "../../webidl/exception.ts";
import { encodingParseURL } from "../infra/url.ts";

@Exposed(Window)
export class Location implements ILocation {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-location-href)
   */
  @stringifier
  get href(): string {
    const { relevantDocument, url } = this.#_;
    // 1. If this's relevant Document is non-null and its origin is not same origin-domain with the entry settings object's origin, then throw a "SecurityError" DOMException.
    // if (
    //   relevantDocument &&
    //   !sameOriginDomain(
    //     DOM.$(relevantDocument).origin,
    //     environmentSettingsObject.origin,
    //   )
    // ) throw new DOMException("<message>", DOMExceptionName.SecurityError);

    // 2. Return this's url, serialized.
    return URLSerializer.serialize(url);
  }

  set href(value: string) {
    // 1. If this's relevant Document is null, then return.
    if (!this.#_.relevantDocument) return;

    // // 2. Let url be the result of encoding-parsing a URL given the given value, relative to the entry settings object.
    // const url = encodingParseURL(value, environmentSettingsObject);

    // // 3. If url is failure, then throw a "SyntaxError" DOMException.
    // if (!url) {
    //   throw new DOMException("<message>", DOMExceptionName.SyntaxError);
    // }

    // 4. Location-object navigate this to url.
    throw new Error("href#setter");
  }

  get origin(): string {
    throw new Error("origin#getter");
  }

  get protocol(): string {
    throw new Error("href#getter");
  }
  set protocol(value: string) {
    throw new Error("protocol#setter");
  }

  get host(): string {
    throw new Error("href#getter");
  }
  set host(value: string) {
    throw new Error("host#setter");
  }

  get hostname(): string {
    throw new Error("hostname#getter");
  }
  set hostname(value: string) {
    throw new Error("hostname#setter");
  }

  get port(): string {
    throw new Error("port#getter");
  }
  set port(value: string) {
    throw new Error("port#setter");
  }

  get pathname(): string {
    throw new Error("pathname#getter");
  }
  set pathname(value: string) {
    throw new Error("pathname#setter");
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-location-search)
   */
  get search(): string {
    const { url } = this.#_;
    // 1. If this's relevant Document is non-null and its origin is not same origin-domain with the entry settings object's origin, then throw a "SecurityError" DOMException.
    // TODO

    // 2. If this's url's query is either null or the empty string, return the empty string.
    if (url.search) return "";

    // 3. Return "?", followed by this's url's query.
    return "?" + url.search;
  }

  set search(value: string) {
    throw new Error("search#setter");
  }

  get hash(): string {
    throw new Error("hash#getter");
  }
  set hash(value: string) {
    throw new Error("hash#setter");
  }

  assign(url: string | URL): void {
    throw new Error("assign");
  }

  replace(url: string | URL): void {
    throw new Error("replace");
  }

  reload(): void;
  reload(): void;
  reload(forcedReload: boolean): void;
  reload(forcedReload?: unknown): void {
    throw new Error("reload");
  }

  get ancestorOrigins(): DOMStringList {
    throw new Error("ancestorOrigins#getter");
  }

  get #_() {
    return $<Location>(this);
  }
}

export class LocationInternals {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#relevant-document)
   */
  get relevantDocument(): Document | null {
    // its relevant global object's browsing context's active document, if this Location object's relevant global object's browsing context is non-null, and null otherwise.
    const globalBrowsingContext = browsingContext(window); // TODO

    return globalBrowsingContext && activeDocument(globalBrowsingContext);
  }

  get url(): URL {
    const document = this.relevantDocument;

    return document ? DOM.$(document).URL : new URL("about:blank");
  }
}
