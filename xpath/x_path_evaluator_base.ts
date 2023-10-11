import { type Node } from "../nodes/node.ts";
import { type IXPathEvaluatorBase } from "../interface.d.ts";

export class XPathEvaluatorBase implements IXPathEvaluatorBase {
  createExpression(
    _expression: string,
    _resolver: XPathNSResolver | null = null,
  ): XPathExpression {
    throw new Error("createExpression is not supported");
  }

  /**
   * @see [HTML Living Standard](https://dom.spec.whatwg.org/#dom-xpathevaluatorbase-creatensresolver)
   */
  createNSResolver(nodeResolver: Node): Node {
    // return nodeResolver.
    return nodeResolver;
  }

  evaluate(
    _expression: string,
    _contextNode: Node,
    _resolver: XPathNSResolver | null = null,
    _type = 0,
    _result: XPathResult | null = null,
  ): XPathResult {
    throw new Error("evaluate is not supported");
  }
}
