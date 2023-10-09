import * as Selection from "../window.ts";
import * as HTML from "../../html/loading_web_pages/window.ts";
import { includes } from "../../utils.ts";

declare module "../../html/loading_web_pages/window.ts" {
  interface Window extends Selection.Window {}
}

includes(HTML.Window, Selection.Window);
