import { Constructor, isOk, Result } from "../../deps.ts";
import { type Element } from "../../nodes/elements/element.ts";
import type { IHTMLHyperlinkElementUtils } from "../interface.d.ts";
import { $ } from "../../internal.ts";

export function HTMLHyperlinkElementUtils<T extends Constructor<Element>>(
  Ctor: T,
) {
  abstract class HTMLHyperlinkElementUtils extends Ctor
    implements IHTMLHyperlinkElementUtils {
    #url: URL | null = null;

    #reinitializeURL(): void {
      const url = this.#url;
      // 1. If element's url is non-null, its scheme is "blob", and it has an opaque path, then terminate these steps.
      if (url && url.protocol === "blob" && hasOpaquePath(url)) return;

      // 2. Set the url.
      this.#setURL();
    }

    /**
     * @see https://html.spec.whatwg.org/multipage/links.html#concept-hyperlink-url-set
     */
    #setURL(): void {
      // 1. If this element's href content attribute is absent, set this element's url to null.
      if (!this.hasAttribute("href")) this.#url = null;
      // 2. Otherwise, parse this element's href content attribute value relative to this element's node document. If parsing is successful, set this element's url to the result; otherwise, set this element's url to null.
      else {
        const document = $<HTMLHyperlinkElementUtils>(this).nodeDocument;
        const href = this.getAttribute("href")!;
        const result = parseURL(href, document);

        if (isOk(result)) this.#url = result.get.record;
        else this.#url = null;
      }
    }

    get hash(): string {
      throw new Error("hash#getter");
    }

    set hash(value: string) {
      throw new Error("hash#setter");
    }

    get host(): string {
      throw new Error("host#getter");
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

    /**
     * @see https://html.spec.whatwg.org/multipage/links.html#dom-hyperlink-href
     */
    get href(): string {
      // 1. Reinitialize url.
      this.#reinitializeURL();

      // 2. Let url be this's url.
      const url = this.#url;

      // 3. If url is null and this has no href content attribute, return the empty string.
      if (url === null && !this.hasAttribute("href")) return "";

      // 4. Otherwise, if url is null, return this's href content attribute's value.
      if (url === null) return this.getAttribute("href")!;

      // 5. Return url, serialized.
      return url.href;
    }

    /**
     * @see https://html.spec.whatwg.org/multipage/links.html#dom-hyperlink-href
     */
    set href(value: string) {
      // set this's href content attribute's value to the given value.
      this.setAttribute("href", value);
    }

    get origin(): string {
      throw new Error("origin#getter");
    }

    get password(): string {
      throw new Error("password#getter");
    }

    set password(value: string) {
      throw new Error("password#setter");
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

    get protocol(): string {
      throw new Error("protocol#getter");
    }

    set protocol(value: string) {
      throw new Error("protocol#setter");
    }

    get search(): string {
      throw new Error("search#getter");
    }

    set search(value: string) {
      throw new Error("search#setter");
    }

    get username(): string {
      throw new Error("username#getter");
    }

    set username(value: string) {
      throw new Error("username#setter");
    }
  }

  return HTMLHyperlinkElementUtils;
}

// deno-lint-ignore no-empty-interface
export interface HTMLHyperlinkElementUtils extends IHTMLHyperlinkElementUtils {}

interface ParsedURL {
  string: string;
  record: URL;
}

/**
 * @see https://html.spec.whatwg.org/multipage/urls-and-fetching.html#parse-a-url
 */
export function parseURL(
  url: string,
  document: Document,
): Result<ParsedURL, string> {
  throw new Error("parseURL");
}

/**
 * @see https://url.spec.whatwg.org/#url-opaque-path
 */
function hasOpaquePath(url: URL): boolean {
  throw new Error("hasOpaquePath");
}
