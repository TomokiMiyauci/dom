import type { IHTMLAudioElement } from "../../interface.d.ts";
import { HTMLMediaElement } from "./html_media_element.ts";

export class HTMLAudioElement extends HTMLMediaElement
  implements IHTMLAudioElement {}
