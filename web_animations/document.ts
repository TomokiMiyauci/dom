import { type Constructor } from "../deps.ts";

interface IDocument_WebAnimation extends Pick<Document, "timeline"> {}

export function Document_WebAnimation<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements IDocument_WebAnimation {
    get timeline(): DocumentTimeline {
      throw new Error();
    }
  }

  return Mixin;
}

export interface Document_WebAnimation extends IDocument_WebAnimation {}
