import type { IElement } from "../interface.d.ts";

type IElement_CSSOMView = Pick<
  IElement,
  | "getClientRects"
  | "getBoundingClientRect"
  | "checkVisibility"
  | "scrollIntoView"
  | "scroll"
  | "scrollTo"
  | "scrollBy"
  | "scrollTop"
  | "scrollLeft"
  | "scrollWidth"
  | "scrollHeight"
  | "clientTop"
  | "clientLeft"
  | "clientWidth"
  | "clientHeight"
>;

export class Element implements IElement_CSSOMView {
  getBoundingClientRect(): DOMRect {
    throw new Error("getBoundingClientRect");
  }

  getClientRects(): DOMRectList {
    throw new Error("getClientRects");
  }

  checkVisibility(options?: CheckVisibilityOptions | undefined): boolean {
    throw new Error("checkVisibility");
  }

  scroll(options?: ScrollToOptions | undefined): void;
  scroll(x: number, y: number): void;
  scroll(x?: unknown, y?: unknown): void {
    throw new Error("scroll");
  }

  scrollBy(options?: ScrollToOptions | undefined): void;
  scrollBy(x: number, y: number): void;
  scrollBy(x?: unknown, y?: unknown): void {
    throw new Error("scrollBy");
  }

  scrollIntoView(arg?: boolean | ScrollIntoViewOptions | undefined): void {
    throw new Error("scrollIntoView");
  }

  scrollTo(options?: ScrollToOptions | undefined): void;
  scrollTo(x: number, y: number): void;
  scrollTo(x?: unknown, y?: unknown): void {
    throw new Error("scrollTo");
  }

  get clientHeight(): number {
    throw new Error("clientHeight");
  }

  get clientLeft(): number {
    throw new Error("clientLeft");
  }

  get clientTop(): number {
    throw new Error("clientTop");
  }

  get clientWidth(): number {
    throw new Error("clientWidth");
  }

  get scrollHeight(): number {
    throw new Error("scrollHeight");
  }

  get scrollLeft(): number {
    throw new Error("scrollLeft getter");
  }

  set scrollLeft(value: number) {
    throw new Error("scrollLeft setter");
  }

  get scrollTop(): number {
    throw new Error("scrollTop getter");
  }

  set scrollTop(value: number) {
    throw new Error("scrollTop setter");
  }

  get scrollWidth(): number {
    throw new Error("scrollWidth");
  }
}
