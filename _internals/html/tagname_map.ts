import { HTMLHtmlElement } from "./semantics/html_html_element.ts";
import { HTMLHeadElement } from "./semantics/html_head_element.ts";
import { HTMLTitleElement } from "./semantics/html_title_element.ts";
import { HTMLBodyElement } from "./elements/html_body_element.ts";
import { HTMLElement } from "./dom/html_element.ts";
import { HTMLUnknownElement } from "./dom/html_unknown_element.ts";
import { HTMLAnchorElement } from "./elements/html_anchor_element.ts";
import { HTMLAreaElement } from "./elements/html_area_element.ts";
import { HTMLAudioElement } from "./elements/html_audio_element.ts";
import { HTMLBaseElement } from "./elements/html_base_element.ts";
import { HTMLBRElement } from "./elements/html_br_element.ts";
import { HTMLButtonElement } from "./elements/html_button_element.ts";
import { HTMLCanvasElement } from "./elements/html_canvas_element.ts";
import { HTMLTableCaptionElement } from "./elements/html_table_caption_element.ts";
import { HTMLTableColElement } from "./elements/html_table_col_element.ts";
import { HTMLDataElement } from "./elements/html_data_element.ts";
import { HTMLDataListElement } from "./elements/html_data_list_element.ts";
import { HTMLDialogElement } from "./elements/html_dialog_element.ts";
import { HTMLModElement } from "./elements/html_mod_element.ts";
import { HTMLDirectoryElement } from "./elements/html_directory_element.ts";
import { HTMLDivElement } from "./elements/html_div_element.ts";
import { HTMLDListElement } from "./elements/html_dlist_element.ts";
import { HTMLEmbedElement } from "./elements/html_embed_element.ts";
import { HTMLFieldSetElement } from "./elements/html_field_set_element.ts";
import { HTMLFontElement } from "./elements/html_font_element.ts";
import { HTMLFormElement } from "./elements/html_form_element.ts";
import { HTMLFrameElement } from "./elements/html_frame_element.ts";
import { HTMLFrameSetElement } from "./elements/html_frame_set_element.ts";
import { HTMLHeadingElement } from "./elements/html_heading_element.ts";
import { HTMLHRElement } from "./elements/html_hr_element.ts";
import { HTMLIFrameElement } from "./elements/html_iframe_element.ts";
import { HTMLImageElement } from "./elements/html_image_element.ts";
import { HTMLInputElement } from "./elements/html_input_element.ts";
import { HTMLLabelElement } from "./elements/html_label_element.ts";
import { HTMLLegendElement } from "./elements/html_legend_element.ts";
import { HTMLLIElement } from "./elements/html_li_element.ts";
import { HTMLLinkElement } from "./elements/html_link_element.ts";
import { HTMLMapElement } from "./elements/html_map_element.ts";
import { HTMLMetaElement } from "./elements/html_meta_element.ts";
import { HTMLMeterElement } from "./elements/html_meter_element.ts";
import { HTMLObjectElement } from "./elements/html_object_element.ts";
import { HTMLScriptElement } from "./elements/scripting/html_script_element.ts";
import { HTMLSelectElement } from "./elements/html_select_element.ts";
import { HTMLSourceElement } from "./elements/html_source_element.ts";
import { HTMLSpanElement } from "./elements/html_span_element.ts";
import { HTMLStyleElement } from "./elements/html_style_element.ts";
import { HTMLTableElement } from "./elements/html_table_element.ts";
import { HTMLTableSectionElement } from "./elements/html_table_section_element.ts";
import { HTMLTableCellElement } from "./elements/html_table_cell_element.ts";
import { HTMLTextAreaElement } from "./elements/html_text_area_element.ts";
import { HTMLTimeElement } from "./elements/html_time_element.ts";
import { HTMLTableRowElement } from "./elements/html_table_row_element.ts";
import { HTMLTrackElement } from "./elements/html_track_element.ts";
import { HTMLUListElement } from "./elements/html_ulist_element.ts";
import { HTMLVideoElement } from "./elements/html_video_element.ts";
import { HTMLOListElement } from "./elements/html_olist_element.ts";
import { HTMLOptGroupElement } from "./elements/html_opt_group_element.ts";
import { HTMLOptionElement } from "./elements/html_option_element.ts";
import { HTMLParagraphElement } from "./elements/html_paragraph_element.ts";
import { HTMLParamElement } from "./elements/html_param_element.ts";
import { HTMLPreElement } from "./elements/html_pre_element.ts";
import { HTMLProgressElement } from "./elements/html_progress_element.ts";
import { HTMLQuoteElement } from "./elements/html_quote_element.ts";
import { HTMLOutputElement } from "./elements/html_output_element.ts";
import { HTMLTemplateElement } from "./elements/html_template_element.ts";

export const tagNameMap: Record<string, typeof HTMLElement> = {
  html: HTMLHtmlElement,
  head: HTMLHeadElement,
  title: HTMLTitleElement,
  body: HTMLBodyElement,
  a: HTMLAnchorElement,
  abbr: HTMLElement,
  acronym: HTMLElement,
  address: HTMLElement,
  area: HTMLAreaElement,
  article: HTMLElement,
  aside: HTMLElement,
  audio: HTMLAudioElement,
  b: HTMLElement,
  base: HTMLBaseElement,
  bdi: HTMLElement,
  bdo: HTMLElement,
  bgsound: HTMLElement,
  big: HTMLElement,
  blockquote: HTMLElement,
  br: HTMLBRElement,
  button: HTMLButtonElement,
  canvas: HTMLCanvasElement,
  caption: HTMLTableCaptionElement,
  center: HTMLElement,
  cite: HTMLElement,
  code: HTMLElement,
  col: HTMLTableColElement,
  colgroup: HTMLTableColElement,
  data: HTMLDataElement,
  datalist: HTMLDataListElement,
  dialog: HTMLDialogElement,
  dd: HTMLElement,
  del: HTMLModElement,
  details: HTMLElement,
  dfn: HTMLElement,
  dir: HTMLDirectoryElement,
  div: HTMLDivElement,
  dl: HTMLDListElement,
  dt: HTMLElement,
  embed: HTMLEmbedElement,
  fieldset: HTMLFieldSetElement,
  figcaption: HTMLElement,
  figure: HTMLElement,
  font: HTMLFontElement,
  footer: HTMLElement,
  form: HTMLFormElement,
  frame: HTMLFrameElement,
  frameset: HTMLFrameSetElement,
  h1: HTMLHeadingElement,
  h2: HTMLHeadingElement,
  h3: HTMLHeadingElement,
  h4: HTMLHeadingElement,
  h5: HTMLHeadingElement,
  h6: HTMLHeadingElement,
  header: HTMLElement,
  hgroup: HTMLElement,
  hr: HTMLHRElement,
  i: HTMLElement,
  iframe: HTMLIFrameElement,
  img: HTMLImageElement,
  input: HTMLInputElement,
  ins: HTMLModElement,
  isindex: HTMLElement,
  kbd: HTMLElement,
  label: HTMLLabelElement,
  legend: HTMLLegendElement,
  li: HTMLLIElement,
  link: HTMLLinkElement,
  main: HTMLElement,
  map: HTMLMapElement,
  mark: HTMLElement,
  marquee: HTMLElement,
  meta: HTMLMetaElement,
  meter: HTMLMeterElement,
  nav: HTMLElement,
  nobr: HTMLElement,
  noframes: HTMLElement,
  noscript: HTMLElement,
  object: HTMLObjectElement,
  ol: HTMLOListElement,
  optgroup: HTMLOptGroupElement,
  option: HTMLOptionElement,
  output: HTMLOutputElement,
  p: HTMLParagraphElement,
  param: HTMLParamElement,
  pre: HTMLPreElement,
  progress: HTMLProgressElement,
  q: HTMLQuoteElement,
  rp: HTMLElement,
  rt: HTMLElement,
  ruby: HTMLElement,
  s: HTMLElement,
  samp: HTMLElement,
  script: HTMLScriptElement,
  section: HTMLElement,
  select: HTMLSelectElement,
  small: HTMLElement,
  source: HTMLSourceElement,
  spacer: HTMLElement,
  span: HTMLSpanElement,
  strike: HTMLElement,
  style: HTMLStyleElement,
  sub: HTMLElement,
  summary: HTMLElement,
  sup: HTMLElement,
  table: HTMLTableElement,
  tbody: HTMLTableSectionElement,
  td: HTMLTableCellElement,
  template: HTMLTemplateElement,
  textarea: HTMLTextAreaElement,
  th: HTMLTableCellElement,
  time: HTMLTimeElement,
  tr: HTMLTableRowElement,
  tt: HTMLElement,
  track: HTMLTrackElement,
  u: HTMLElement,
  ul: HTMLUListElement,
  var: HTMLElement,
  video: HTMLVideoElement,
  unknown: HTMLUnknownElement,
  wbr: HTMLElement,
};
