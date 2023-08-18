import {
  DOMExceptionDescription,
  DOMExceptionName,
} from "../webidl/exception.ts";
import { divide, isNotNull } from "../deps.ts";

/**
 * [Infra Living Standard](https://infra.spec.whatwg.org/#namespaces)
 */
export enum Namespace {
  /** HTML namespace
   * @see https://infra.spec.whatwg.org/#html-namespace
   */
  HTML = "http://www.w3.org/1999/xhtml",

  /** MathML namespace
   * @see https://infra.spec.whatwg.org/#mathml-namespace
   */
  MathML = "http://www.w3.org/1998/Math/MathML",

  /** SVG namespace
   * @see https://infra.spec.whatwg.org/#svg-namespace
   */
  SVG = "http://www.w3.org/2000/svg",

  /** XLink namespace
   * @see https://infra.spec.whatwg.org/#xlink-namespace
   */
  XLink = "http://www.w3.org/1999/xlink",

  /** XML namespace
   * @see https://infra.spec.whatwg.org/#xml-namespace
   */
  XML = "http://www.w3.org/XML/1998/namespace",

  /** XMLNS namespace
   * @see https://infra.spec.whatwg.org/#xmlns-namespace
   */
  XMLNS = "http://www.w3.org/2000/xmlns/",
}

/**
 * @see https://dom.spec.whatwg.org/#validate
 */
export function validate(qualifiedName: string) {
  // throw an "InvalidCharacterError" DOMException if qualifiedName does not match the QName production.
}

/**
 * @see https://dom.spec.whatwg.org/#validate-and-extract
 */
export function validateAndExtract(
  namespace: string | null,
  qualifiedName: string,
): {
  namespace: string | null;
  prefix: string | null;
  localName: string;
} {
  // 1. If namespace is the empty string, then set it to null.
  namespace ||= null;

  // 2. Validate qualifiedName.
  validate(qualifiedName);

  // 3. Let prefix be null.
  let prefix = null;

  // 4. Let localName be qualifiedName.
  let localName = qualifiedName;

  // 5. If qualifiedName contains a U+003A (:), then:
  if (qualifiedName.includes(":")) {
    // @optimized
    // 1. Let splitResult be the result of running strictly split given qualifiedName and U+003A (:).
    const splitResult = divide(qualifiedName, ":");

    // 2. Set prefix to splitResult[0].
    prefix = splitResult[0];

    // 3. Set localName to splitResult[1].
    localName = splitResult[1];
  }

  // 6. If prefix is non-null and namespace is null, then throw a "NamespaceError" DOMException.
  if (isNotNull(prefix) && namespace === null) {
    throw new DOMException(
      DOMExceptionDescription.NamespaceError,
      DOMExceptionName.NamespaceError,
    );
  }

  // 7. If prefix is "xml" and namespace is not the XML namespace, then throw a "NamespaceError" DOMException.
  if (prefix === "xml" && namespace !== Namespace.XML) {
    throw new DOMException(
      DOMExceptionDescription.NamespaceError,
      DOMExceptionName.NamespaceError,
    );
  }

  // 8. If either qualifiedName or prefix is "xmlns" and namespace is not the XMLNS namespace, then throw a "NamespaceError" DOMException.
  if (
    (qualifiedName === "xmlns" || prefix === "xmlns") &&
    namespace !== Namespace.XMLNS
  ) {
    throw new DOMException(
      DOMExceptionDescription.NamespaceError,
      DOMExceptionName.NamespaceError,
    );
  }

  // 9. If namespace is the XMLNS namespace and neither qualifiedName nor prefix is "xmlns", then throw a "NamespaceError" DOMException.
  if (
    namespace === Namespace.XMLNS && (qualifiedName !== "xmlns") &&
    prefix !== "xmlns"
  ) {
    throw new DOMException(
      DOMExceptionDescription.NamespaceError,
      DOMExceptionName.NamespaceError,
    );
  }

  // 10. Return namespace, prefix, and localName.
  return { namespace, prefix, localName };
}
