import { Navigable } from "./infrastructure_for_sequences_of_documents/navigable.ts";
import { Navigation } from "./navigation.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#abort-the-ongoing-navigation)
 */
export function abortOngoingNavigation(
  navigation: Navigation,
  error: DOMException,
): void {
  // TODO
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#inform-the-navigation-api-about-aborting-navigation)
 */
export function informNavigationAPIAboutAbortingNavigation(
  navigable: Navigable,
): void {
  // TODO
}
