import { HTMLOrSVGElement } from "../dom/html_or_svg_element.ts";
import { SVGElement } from "../../svg/elements/svg_element.ts";
import { includes } from "../../../utils.ts";

declare module "../../svg/elements/svg_element.ts" {
  interface SVGElement extends HTMLOrSVGElement {}
}

includes(SVGElement, HTMLOrSVGElement);
