import { UnImplemented } from "./utils.ts";
import type { IDOMImplementation } from "../interface.d.ts";

export class DOMImplementation implements IDOMImplementation {
  createDocumentType(
    qualifiedName: string,
    publicId: string,
    systemId: string,
  ): DocumentType {
    throw new UnImplemented();
  }

  createDocument(
    namespace: string | null,
    qualifiedName: string | null,
    doctype?: DocumentType | null | undefined,
  ): XMLDocument {
    throw new UnImplemented();
  }

  createHTMLDocument(title?: string | undefined): Document {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
   */
  hasFeature(..._: readonly unknown[]): true {
    // return true
    return true;
  }
}
