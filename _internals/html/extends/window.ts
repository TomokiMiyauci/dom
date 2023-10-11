import { ElementInternals } from "../../nodes/element.ts";

declare module "../../nodes/element.ts" {
  interface ElementInternals {
    /**
     * @default false
     * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/interaction.html#click-in-progress-flag)
     */
    clickInProgress: boolean;
  }
}

ElementInternals.prototype.clickInProgress = false;
