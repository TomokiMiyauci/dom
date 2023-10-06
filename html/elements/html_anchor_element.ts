import type { IHTMLAnchorElement } from "../../interface.d.ts";
import { HTMLHyperlinkElementUtils } from "../html_hyperlink_element_utils.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { DOMTokenList } from "../../dom/sets/dom_token_list.ts";
import { reflect } from "../infrastructure.ts";
import { PutForwards, SameObject } from "../../webidl/extended_attribute.ts";
import { $, internalSlots } from "../../internal.ts";
import {
  navigate,
  UserNavigationInvolvement,
  userNavigationInvolvement,
} from "../loading_web_pages/navigation_and_session_histories/navigation.ts";
import { encodingParseAndSerializeURL } from "../infra/url.ts";

@HTMLHyperlinkElementUtils
export class HTMLAnchorElement extends HTMLElement
  implements IHTMLAnchorElement {
  constructor(...args: any) {
    super(...args);

    internalSlots.get<HTMLAnchorElement>(this).activationBehavior = (event) => {
      // 1. If element has no href attribute, then return.
      if (!this.hasAttribute("href")) return;

      // 2. Let hyperlinkSuffix be null.
      let hyperlinkSuffix = null;

      // 3. If element is an a element, and event's target is an img with an ismap attribute specified, then:

      // 1. Let x and y be 0.

      // 2. If event's isTrusted attribute is initialized to true, then set x to the distance in CSS pixels from the left edge of the image to the location of the click, and set y to the distance in CSS pixels from the top edge of the image to the location of the click.

      // 3. If x is negative, set x to 0.

      // 4. If y is negative, set y to 0.

      // 5. Set hyperlinkSuffix to the concatenation of U+003F (?), the value of x expressed as a base-ten integer using ASCII digits, U+002C (,), and the value of y expressed as a base-ten integer using ASCII digits.

      // 4. Let userInvolvement be event's user navigation involvement.
      const userInvolvement = userNavigationInvolvement(event);

      // 5. If the user has expressed a preference to download the hyperlink, then set userInvolvement to "browser UI".

      // 6. If element has a download attribute, or if the user has expressed a preference to download the hyperlink, then download the hyperlink created by element with hyperlinkSuffix set to hyperlinkSuffix and userInvolvement set to userInvolvement.
      if (this.hasAttribute("download")) {}
      else {
        // 7. Otherwise, follow the hyperlink created by element with hyperlinkSuffix set to hyperlinkSuffix and userInvolvement set to userInvolvement.
        followHyperlink(this, hyperlinkSuffix, userInvolvement);
      }
    };
  }
  get charset(): string {
    throw new Error("text#getter");
  }

  set charset(value: string) {
    throw new Error("text#setter");
  }

  get coords(): string {
    throw new Error("coords#getter");
  }

  set coords(value: string) {
    throw new Error("coords#setter");
  }

  get download(): string {
    throw new Error("download#getter");
  }

  set download(value: string) {
    throw new Error("download#setter");
  }

  get hreflang(): string {
    throw new Error("hreflang#getter");
  }

  set hreflang(value: string) {
    throw new Error("hreflang#setter");
  }

  get name(): string {
    throw new Error("name#getter");
  }

  set name(value: string) {
    throw new Error("name#setter");
  }

  get ping(): string {
    throw new Error("ping#getter");
  }

  set ping(value: string) {
    throw new Error("ping#setter");
  }

  get referrerPolicy(): string {
    throw new Error("referrerPolicy#getter");
  }

  set referrerPolicy(value: string) {
    throw new Error("referrerPolicy#setter");
  }

  get rel(): string {
    throw new Error("rel#getter");
  }

  set rel(value: string) {
    throw new Error("rel#setter");
  }

  /**
   * @see https://html.spec.whatwg.org/multipage/text-level-semantics.html#dom-a-rellist
   */
  @SameObject
  @PutForwards("value")
  get relList(): DOMTokenList {
    // reflect the rel content attribute.
    return reflect(this, DOMTokenList, "rel");
  }

  get rev(): string {
    throw new Error("rev#getter");
  }

  set rev(value: string) {
    throw new Error("rev#setter");
  }

  get shape(): string {
    throw new Error("shape#getter");
  }

  set shape(value: string) {
    throw new Error("shape#setter");
  }

  get target(): string {
    throw new Error("target#getter");
  }

  set target(value: string) {
    throw new Error("target#setter");
  }

  get text(): string {
    throw new Error("text#getter");
  }

  set text(value: string) {
    throw new Error("text#setter");
  }

  get type(): string {
    throw new Error("type#getter");
  }

  set type(value: string) {
    throw new Error("type#setter");
  }
}

// deno-lint-ignore no-empty-interface
export interface HTMLAnchorElement extends HTMLHyperlinkElementUtils {}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/links.html#following-hyperlinks-2)
 */
export function followHyperlink(
  subject: Element,
  hyperlinkSuffix: string | null = null,
  userInvolvement = UserNavigationInvolvement.None,
): void {
  // 1. If subject cannot navigate, then return.

  // 2. Let replace be false.

  // 3. Let targetAttributeValue be the empty string.

  // 4. If subject is an a or area element, then set targetAttributeValue to the result of getting an element's target given subject.

  // 5. Let noopener be the result of getting an element's noopener with subject and targetAttributeValue.

  // 6. Let targetNavigable be the first return value of applying the rules for choosing a navigable given targetAttributeValue, subject's node navigable, and noopener.

  // 7. If targetNavigable is null, then return.

  // 8. Let urlString be the result of encoding-parsing-and-serializing a URL given subject's href attribute value, relative to subject's node document.
  let urlString = encodingParseAndSerializeURL(
    subject.getAttribute("href") ?? "",
    $(subject).nodeDocument,
  );

  // 9. If urlString is failure, then return.
  if (urlString === false) return;

  // 10. If hyperlinkSuffix is non-null, then append it to urlString.
  if (hyperlinkSuffix) urlString += hyperlinkSuffix;

  // 11. Let referrerPolicy be the current state of subject's referrerpolicy content attribute.

  // 12. If subject's link types includes the noreferrer keyword, then set referrerPolicy to "no-referrer".

  // 13. Navigate targetNavigable to urlString using subject's node document, with referrerPolicy set to referrerPolicy and userInvolvement set to userInvolvement.
  navigate(
    {
      activeSessionHistoryEntry: {
        documentState: $(subject).nodeDocument,
        URL: $($(subject).nodeDocument).URL,
      },
    } as any,
    new URL(urlString),
    $(subject).nodeDocument,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    userInvolvement,
  );
}
