import { Selection } from "./selection.ts";

interface IDocument_Selection extends Pick<Document, "getSelection"> {}

export class Document implements IDocument_Selection {
  getSelection(): Selection | null {
    return this._selection;
  }

  _selection: Selection = new Selection();
}
