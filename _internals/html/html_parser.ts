import { Document } from "../../nodes/document.ts";
import { DOMTreeAdapter, type DOMTreeAdapterMap } from "./_adapter.ts";
import { parse } from "../../deps.ts";
import { $ } from "../../internal.ts";
import { getEncoding, windows_1252 } from "../encoding/encoding.ts";
import { nodeDocument } from "../../symbol.ts";
import type { $Element } from "../../i.ts";
import { encoding, mode, type } from "../../symbol.ts";

export class HTMLParser {
  #adaptor: DOMTreeAdapter;
  constructor(public document: Document) {
    this.#adaptor = new DOMTreeAdapter(document);
  }

  parse(input: string): Document {
    const document = parse<DOMTreeAdapterMap>(input, {
      treeAdapter: this.#adaptor,
    });

    const meta = document.head.querySelector("meta[charset]");

    if (meta) {
      const charsetValue = meta.getAttribute("charset") ?? "";
      let charset = getEncoding(charsetValue);

      // 15. If charset is x-user-defined, then set charset to windows-1252.
      if (charsetValue === "x-user-defined") charset = windows_1252;

      if (charset) document[encoding] = charset;
    }

    return document;
  }
}

/**
 * @see https://html.spec.whatwg.org/multipage/parsing.html#html-fragment-parsing-algorithm
 */
export function parseHTMLFragment(
  context: $Element,
  input: string,
): Iterable<Node> {
  console.warn("parseHTMLFragment is not standard behavior");

  // 1. Create a new Document node, and mark it as being an HTML document.
  const document = new Document();
  document[type] = "html";

  // 2. If the node document of the context element is in quirks mode, then let the Document be in quirks mode. Otherwise, the node document of the context element is in limited-quirks mode, then let the Document be in limited-quirks mode. Otherwise, leave the Document in no-quirks mode.
  document[mode] = context[nodeDocument][mode];

  // 3. Create a new HTML parser, and associate it with the just created Document node.
  const parser = new HTMLParser(document);

  // 4. Set the state of the HTML parser's tokenization stage as follows, switching on the context element:

  // title
  // textarea
  // Switch the tokenizer to the RCDATA state.
  // style
  // xmp
  // iframe
  // noembed
  // noframes
  // Switch the tokenizer to the RAWTEXT state.
  // script
  // Switch the tokenizer to the script data state.
  // noscript
  // If the scripting flag is enabled, switch the tokenizer to the RAWTEXT state. Otherwise, leave the tokenizer in the data state.
  // plaintext
  // Switch the tokenizer to the PLAINTEXT state.
  // Any other element
  // Leave the tokenizer in the data state.
  // For performance reasons, an implementation that does not report errors and that uses the actual state machine described in this specification directly could use the PLAINTEXT state instead of the RAWTEXT and script data states where those are mentioned in the list above. Except for rules regarding parse errors, they are equivalent, since there is no appropriate end tag token in the fragment case, yet they involve far fewer state transitions.

  // 5. Let root be a new html element with no attributes.

  // 6. Append the element root to the Document node created above.

  // 7. Set up the parser's stack of open elements so that it contains just the single element root.

  // 8. If the context element is a template element, push "in template" onto the stack of template insertion modes so that it is the new current template insertion mode.

  // 9. Create a start tag token whose name is the local name of context and whose attributes are the attributes of context.

  // Let this start tag token be the start tag token of the context node, e.g. for the purposes of determining if it is an HTML integration point.

  // 10. Reset the parser's insertion mode appropriately.

  // 11. Set the parser's form element pointer to the nearest node to the context element that is a form element (going straight up the ancestor chain, and including the element itself, if it is a form element), if any. (If there is no such form element, the form element pointer keeps its initial value, null.)

  // 12. Place the input into the input stream for the HTML parser just created. The encoding confidence is irrelevant.

  // 13. Start the parser and let it run until it has consumed all the characters just inserted into the input stream.

  // 14. Return the child nodes of root, in tree order.

  parser.parse(input);

  return document.body.childNodes;
}
