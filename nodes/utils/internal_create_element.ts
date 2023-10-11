import { createElement } from "./create_element.ts";
import { validateAndExtract } from "../../_internals/infra/namespace.ts";

/**
 * @see https://dom.spec.whatwg.org/#internal-createelementns-steps
 */
export function internalCreateElement(
  document: globalThis.Document,
  namespace: string | null,
  qualifiedName: string,
  options?: string | ElementCreationOptions,
): globalThis.Element {
  // 1. Let namespace, prefix, and localName be the result of passing namespace and qualifiedName to validate and extract.
  const { namespace: $namespace, prefix, localName } = validateAndExtract(
    namespace,
    qualifiedName,
  );

  // 2. Let is be null.
  let is: string | null = null;

  // 3. If options is a dictionary and options["is"] exists, then set is to it.
  if (typeof options === "object" && "is" in options) {
    is = options["is"] ?? null;
  }

  // 4. Return the result of creating an element given document, localName, namespace, prefix, is, and with the synchronous custom elements flag set.
  return createElement(document, localName, $namespace, prefix, is);
}
