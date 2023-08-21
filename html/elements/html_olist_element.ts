import type { IHTMLOListElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLOListElement extends HTMLElement implements IHTMLOListElement {
  get compact(): boolean {
    throw new Error("compact#getter");
  }

  set compact(value: boolean) {
    throw new Error("compact#setter");
  }

  get reversed(): boolean {
    throw new Error("reversed#getter");
  }

  set reversed(value: boolean) {
    throw new Error("reversed#setter");
  }

  get start(): number {
    throw new Error("start#getter");
  }

  set start(value: number) {
    throw new Error("start#setter");
  }

  get type(): string {
    throw new Error("type#getter");
  }

  set type(value: string) {
    throw new Error("type#setter");
  }
}
