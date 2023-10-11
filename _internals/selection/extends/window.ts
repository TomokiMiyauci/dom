import * as Selection from "../window.ts";
import * as HTML from "../../../_internals/html/loading_web_pages/window.ts";
import { includes } from "../../../utils.ts";

declare module "../../../_internals/html/loading_web_pages/window.ts" {
  interface Window extends Selection.Window {}
}

includes(HTML.Window, Selection.Window);
