import { type Constructor } from "../deps.ts";

interface IDocument_SVG extends Pick<Document, "rootElement"> {}

export function Document_SVG<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements IDocument_SVG {
    get rootElement(): SVGSVGElement | null {
      throw new Error("rootElement#getter");
    }
  }

  return Mixin;
}

export interface Document_SVG extends IDocument_SVG {}
