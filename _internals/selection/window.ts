interface IWindow_Selection extends Pick<Window, "getSelection"> {}

export class Window implements IWindow_Selection {
  getSelection(): Selection | null {
    return this.document.getSelection();
  }
}

export interface Window {
  document: Document;
}
