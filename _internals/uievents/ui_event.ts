import type { IUIEvent } from "../../interface.d.ts";
import { Event } from "../../events/event.ts";
import { Exposed } from "../webidl/extended_attribute.ts";

@Exposed("Window", "UIEvent")
export class UIEvent extends Event implements IUIEvent {
  get view(): Window | null {
    throw new Error("view#getter");
  }

  get detail(): number {
    throw new Error("detail#getter");
  }

  get which(): number {
    throw new Error("which#getter");
  }

  initUIEvent(
    typeArg: string,
    bubblesArg?: boolean | undefined,
    cancelableArg?: boolean | undefined,
    viewArg?: Window | null | undefined,
    detailArg?: number | undefined,
  ): void {
    throw new Error("initUIEvent");
  }
}
