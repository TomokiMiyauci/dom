import type { IHTMLBaseElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLBaseElement extends HTMLElement implements IHTMLBaseElement {
  get href(): string {
    throw new Error("href#getter");
  }

  set href(value: string) {
    throw new Error("href#setter");
  }

  get target(): string {
    throw new Error("target#getter");
  }

  set target(value: string) {
    throw new Error("target#setter");
  }
}
