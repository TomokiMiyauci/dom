import { UnImplemented } from "./utils.ts";
import { Document } from "./document.ts";
import { DocumentType } from "./document_type.ts";
import { Text } from "./text.ts";
import { createElement } from "./element.ts";
import { appendNode } from "./mutation.ts";
import type { IDOMImplementation } from "../interface.d.ts";
import { Namespace } from "../infra/namespace.ts";
import { $create, $document, $nodeDocument, $origin } from "./internal.ts";

export class DOMImplementation implements IDOMImplementation {
  [$document]!: Document;

  static create(document: Document): DOMImplementation {
    const instance = new DOMImplementation();
    instance[$document] = document;

    return instance;
  }

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

  /**
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument
   */
  createHTMLDocument(title?: string | undefined): any {
    // 1. Let doc be a new document that is an HTML document.
    const doc = new Document();
    doc._type === "html";

    // 2. Set doc’s content type to "text/html".
    doc._contentType = "text/html";

    // 3. Append a new doctype, with "html" as its name and with its node document set to doc, to doc.
    // TODO
    const docType = new DocumentType("html");
    docType[$nodeDocument] = doc;
    appendNode(docType, doc);

    // 4. Append the result of creating an element given doc, html, and the HTML namespace, to doc.
    const htmlElement = createElement(doc, "html", Namespace.HTML);
    appendNode(htmlElement, doc);

    // 5. Append the result of creating an element given doc, head, and the HTML namespace, to the html element created earlier.
    const headElement = createElement(doc, "head", Namespace.HTML);
    appendNode(headElement, htmlElement);

    // 6. If title is given:
    if (typeof title === "string") {
      // 1. Append the result of creating an element given doc, title, and the HTML namespace, to the head element created earlier.
      const titleElement = createElement(doc, "title", Namespace.HTML);
      appendNode(titleElement, headElement);

      // 2. Append a new Text node, with its data set to title (which could be the empty string) and its node document set to doc, to the title element created earlier.
      appendNode(
        Text[$create]({ data: title, nodeDocument: doc }),
        titleElement,
      );
    }

    // 7. Append the result of creating an element given doc, body, and the HTML namespace, to the html element created earlier.
    appendNode(createElement(doc, "body", Namespace.HTML), htmlElement);

    // 8. doc’s origin is this’s associated document’s origin.
    doc[$origin] = this[$document][$origin];

    // 9. Return doc.
    return doc;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
   */
  hasFeature(..._: readonly unknown[]): true {
    // return true
    return true;
  }
}
