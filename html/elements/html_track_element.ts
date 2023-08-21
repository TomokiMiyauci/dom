import type { IHTMLTrackElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLTrackElement extends HTMLElement implements IHTMLTrackElement {
  get default(): boolean {
    throw new Error("default#getter");
  }
  set default(value: boolean) {
    throw new Error("default#setter");
  }

  get kind(): string {
    throw new Error("kind#getter");
  }
  set kind(value: string) {
    throw new Error("kind#setter");
  }

  get label(): string {
    throw new Error("label#getter");
  }
  set label(value: string) {
    throw new Error("label#setter");
  }

  get readyState(): number {
    throw new Error("readyState");
  }

  get src(): string {
    throw new Error("src#getter");
  }
  set src(value: string) {
    throw new Error("src#setter");
  }

  get srclang(): string {
    throw new Error("srclang#getter");
  }
  set srclang(value: string) {
    throw new Error("srclang#setter");
  }

  get track(): TextTrack {
    throw new Error("track");
  }
  readonly NONE = 0;
  readonly LOADING = 1;
  readonly LOADED = 2;
  readonly ERROR = 3;
}
