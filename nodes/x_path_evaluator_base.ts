import { UnImplemented } from "./utils.ts";
import type { Node } from "./node.ts";
import { type IXPathEvaluatorBase } from "../interface.d.ts";

export class XPathEvaluatorBase implements IXPathEvaluatorBase {
  createExpression(
    expression: string,
    resolver?: XPathNSResolver | null | undefined,
  ): XPathExpression {
    throw new UnImplemented();
  }

  createNSResolver(nodeResolver: Node): Node {
    throw new UnImplemented();
  }

  evaluate(
    expression: string,
    contextNode: Node,
    resolver?: XPathNSResolver | null | undefined,
    type?: number | undefined,
    result?: XPathResult | null | undefined,
  ): XPathResult {
    throw new UnImplemented();
  }
}
