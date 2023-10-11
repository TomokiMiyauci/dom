import type { IMouseEvent } from "../interface.d.ts";
import { UIEvent } from "./ui_event.ts";
import { Exposed } from "../webidl/extended_attribute.ts";

@Exposed("Window", "MouseEvent")
export class MouseEvent extends UIEvent implements IMouseEvent {
  get screenX(): number {
    throw new Error("screenX");
  }
  get screenY(): number {
    throw new Error("screenY");
  }
  get clientX(): number {
    throw new Error("clientX");
  }
  get clientY(): number {
    throw new Error("clientY");
  }
  get ctrlKey(): boolean {
    throw new Error("ctrlKey");
  }
  get shiftKey(): boolean {
    throw new Error("shiftKey");
  }
  get altKey(): boolean {
    throw new Error("altKey");
  }
  get metaKey(): boolean {
    throw new Error("metaKey");
  }
  get button(): number {
    throw new Error("button");
  }
  get buttons(): number {
    throw new Error("buttons");
  }

  get relatedTarget(): EventTarget | null {
    throw new Error("relatedTarget");
  }

  getModifierState(keyArg: string): boolean {
    throw new Error("getModifierState");
  }

  get movementX(): number {
    throw new Error("movementX");
  }
  get movementY(): number {
    throw new Error("movementY");
  }
  get offsetX(): number {
    throw new Error("offsetX");
  }
  get offsetY(): number {
    throw new Error("offsetY");
  }
  get pageX(): number {
    throw new Error("pageX");
  }
  get pageY(): number {
    throw new Error("pageY");
  }
  get x(): number {
    throw new Error("x");
  }
  get y(): number {
    throw new Error("y");
  }

  initMouseEvent(
    typeArg: string,
    canBubbleArg: boolean,
    cancelableArg: boolean,
    viewArg: Window,
    detailArg: number,
    screenXArg: number,
    screenYArg: number,
    clientXArg: number,
    clientYArg: number,
    ctrlKeyArg: boolean,
    altKeyArg: boolean,
    shiftKeyArg: boolean,
    metaKeyArg: boolean,
    buttonArg: number,
    relatedTargetArg: EventTarget | null,
  ): void {
    throw new Error("initMouseEvent");
  }
}
