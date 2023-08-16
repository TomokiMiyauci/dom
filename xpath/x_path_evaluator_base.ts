import { UnImplemented } from "../utils.ts";
import { type Node } from "../nodes/node.ts";
import { type IXPathEvaluatorBase } from "../interface.d.ts";
import { Constructor } from "../deps.ts";

export function XPathEvaluatorBase<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements IXPathEvaluatorBase {
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

  return Mixin;
}
// deno-lint-ignore no-empty-interface
export interface XPathEvaluatorBase extends IXPathEvaluatorBase {}
