import { type Constructor } from "../deps.ts";

interface IDocument_Selection extends Pick<Document, "getSelection"> {}

export function Document_Selection<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements IDocument_Selection {
    getSelection(): Selection | null {
      throw new Error();
    }
  }

  return Mixin;
}

export interface Document_Selection extends IDocument_Selection {}
