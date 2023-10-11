import { XPathEvaluatorBase } from "../xpath/x_path_evaluator_base.ts";
import { Document } from "../nodes/document.ts";
import { includes } from "../utils.ts";

declare module "../nodes/document.ts" {
  interface Document extends XPathEvaluatorBase {}
}

includes(Document, XPathEvaluatorBase);
