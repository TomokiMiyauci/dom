import { lookUpCustomElementDefinition } from "../../../html/custom_element.ts";
import { CustomElementState } from "../constant.ts";
import { Element } from "./element.ts";

/**
 * [DOM Living Standard](https://dom.spec.whatwg.org/#concept-create-element)
 */
export function createElement(
  document: Document,
  localName: string,
  namespace: string | null,
  prefix: string | null = null, // 1. If prefix was not given, let prefix be null.
  is: string | null = null, // 2. If is was not given, let is be null.
  synchronousCustomElements: boolean | null = null,
): Element {
  // 3. Let result be null.
  let result: Element | null = null;

  // 4. Let definition be the result of looking up a custom element definition given document, namespace, localName, and is.
  const definition = lookUpCustomElementDefinition(
    document,
    namespace,
    localName,
    is,
  );

  // 5. If definition is non-null, and definition’s name is not equal to its local name (i.e., definition represents a customized built-in element), then:
  if (definition !== null && definition.name !== definition.localName) {
    throw new Error("createElement");
  } // 1. Let interface be the element interface for localName and the HTML namespace.

  // 2. Set result to a new element that implements interface, with no attributes, namespace set to the HTML namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "undefined", custom element definition set to null, is value set to is, and node document set to document.

  // 3. If the synchronous custom elements flag is set, then run this step while catching any exceptions:

  // 1. Upgrade element using definition.

  // If this step threw an exception, then:

  // 1. Report the exception.

  // 2. Set result’s custom element state to "failed".

  // 4. Otherwise, enqueue a custom element upgrade reaction given result and definition.

  // 6. Otherwise, if definition is non-null, then:
  else if (definition !== null) {
    throw new Error("createElement");
  } // 1. If the synchronous custom elements flag is set, then run these steps while catching any exceptions:

  // 1. Let C be definition’s constructor.

  // 2. Set result to the result of constructing C, with no arguments.

  // 3. Assert: result’s custom element state and custom element definition are initialized.

  // 4. Assert: result’s namespace is the HTML namespace.

  // 5. If result’s attribute list is not empty, then throw a "NotSupportedError" DOMException.

  // 6. If result has children, then throw a "NotSupportedError" DOMException.

  // 7. If result’s parent is not null, then throw a "NotSupportedError" DOMException.

  // 8. If result’s node document is not document, then throw a "NotSupportedError" DOMException.

  // 9. If result’s local name is not equal to localName, then throw a "NotSupportedError" DOMException.

  // 10. Set result’s namespace prefix to prefix.

  // 11. Set result’s is value to null.

  // If any of these steps threw an exception, then:

  // 1. Report the exception.

  // 2. Set result to a new element that implements the HTMLUnknownElement interface, with no attributes, namespace set to the HTML namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "failed", custom element definition set to null, is value set to null, and node document set to document.

  // 2. Otherwise:

  // 1. Set result to a new element that implements the HTMLElement interface, with no attributes, namespace set to the HTML namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "undefined", custom element definition set to null, is value set to null, and node document set to document.

  // 2. Enqueue a custom element upgrade reaction given result and definition.

  // 7. Otherwise:
  else {
    // 1. Let interface be the element interface for localName and namespace.
    const Interface = resolveInterface(localName, namespace);

    // 2. Set result to a new element that implements interface, with no attributes, namespace set to namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "uncustomized", custom element definition set to null, is value set to is, and node document set to document.
    result = new Interface({
      namespace,
      namespacePrefix: prefix,
      localName,
      customElementState: CustomElementState.Uncustomized,
      customElementDefinition: null,
      isValue: is,
      nodeDocument: document,
    });

    // 3. If namespace is the HTML namespace, and either localName is a valid custom element name or is is non-null, then set result’s custom element state to "undefined".
  }

  // 8. Return result.
  return result;
}

export interface InterfaceResolver {
  (localName: string): typeof Element;
}
export const interfaceRegistry = new Map<string, InterfaceResolver>();

function resolveInterface(
  localName: string,
  namespace: string | null,
): typeof Element {
  if (namespace === null) return Element;

  if (interfaceRegistry.has(namespace)) {
    const resolver = interfaceRegistry.get(namespace)!;

    return resolver(localName);
  }

  return Element;
}
