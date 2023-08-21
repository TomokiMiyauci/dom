import type { IHTMLMapElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLMapElement extends HTMLElement implements IHTMLMapElement {
  get areas(): HTMLCollection {
    throw new Error("areas");
  }

  get name(): string {
    throw new Error("name#getter");
  }
  set name(value: string) {
    throw new Error("name#setter");
  }
}
