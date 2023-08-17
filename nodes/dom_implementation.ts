import { Document, internalCreateElement, XMLDocument } from "./document.ts";
import { DocumentType } from "./document_type.ts";
import { Text } from "./text.ts";
import type { Element } from "./element.ts";
import { createElement } from "./element.ts";
import { appendNode } from "./mutation.ts";
import type { IDOMImplementation } from "../interface.d.ts";
import { Namespace } from "../infra/namespace.ts";
import { $create, $document, $origin } from "./internal.ts";
import { validate } from "../infra/namespace.ts";

export class DOMImplementation implements IDOMImplementation {
  [$document]!: Document;

  static create(document: Document): DOMImplementation {
    const instance = new DOMImplementation();
    instance[$document] = document;

    return instance;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype
   */
  createDocumentType(
    qualifiedName: string,
    publicId: string,
    systemId: string,
  ): DocumentType {
    // 1. Validate qualifiedName.
    validate(qualifiedName);

    // 2. Return a new doctype, with qualifiedName as its name, publicId as its public ID, and systemId as its system ID, and with its node document set to the associated document of this.
    return new DocumentType({
      name: qualifiedName,
      publicId,
      systemId,
      nodeDocument: this[$document],
    });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument
   */
  createDocument(
    namespace: string | null,
    qualifiedName: string | null,
    doctype: DocumentType | null = null,
  ): XMLDocument {
    // LegacyNullToEmptyString
    qualifiedName ??= "";

    // 1. Let document be a new XMLDocument.
    const document = new XMLDocument();

    // 2. Let element be null.
    let element: Element | null = null;

    // 3. If qualifiedName is not the empty string, then set element to the result of running the internal createElementNS steps, given document, namespace, qualifiedName, and an empty dictionary.
    if (qualifiedName !== "") {
      element = internalCreateElement(document, namespace, qualifiedName, {});
    }

    // 4. If doctype is non-null, append doctype to document.
    if (doctype !== null) appendNode(doctype, document);

    // 5. If element is non-null, append element to document.
    if (element !== null) appendNode(element, document);

    // 6. document’s origin is this’s associated document’s origin.
    document[$origin] = this[$document][$origin];

    // 7. document’s content type is determined by namespace:
    document._contentType = namespaceToContentType(namespace);

    // 8. Return document.
    return document;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument
   */
  createHTMLDocument(title?: string | undefined): Document {
    // 1. Let doc be a new document that is an HTML document.
    const doc = new Document();
    doc._type === "html";

    // 2. Set doc’s content type to "text/html".
    doc._contentType = "text/html";

    // 3. Append a new doctype, with "html" as its name and with its node document set to doc, to doc.
    const docType = new DocumentType({ name: "html", nodeDocument: doc });
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

function namespaceToContentType(namespace: string | null): string {
  switch (namespace) {
    case Namespace.HTML:
      return "application/xhtml+xml";
    case Namespace.SVG:
      return "image/svg+xml";
    default:
      return "application/xml";
  }
}
