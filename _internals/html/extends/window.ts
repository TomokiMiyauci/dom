import { ElementInternals } from "../../nodes/elements/element.ts";

declare module "../../nodes/elements/element.ts" {
  interface ElementInternals {
    /**
     * @default false
     * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/interaction.html#click-in-progress-flag)
     */
    clickInProgress: boolean;
  }
}

ElementInternals.prototype.clickInProgress = false;
