import { XPathEvaluatorBase } from "../xpath/x_path_evaluator_base.ts";
import { Document } from "../nodes/documents/document.ts";
import { includes } from "../utils.ts";

declare module "../nodes/documents/document.ts" {
  interface Document extends XPathEvaluatorBase {}
}

includes(Document, XPathEvaluatorBase);
