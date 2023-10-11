import type { IHTMLAudioElement } from "../../interface.d.ts";
import { HTMLMediaElement } from "./html_media_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLAudioElement")
export class HTMLAudioElement extends HTMLMediaElement
  implements IHTMLAudioElement {}
