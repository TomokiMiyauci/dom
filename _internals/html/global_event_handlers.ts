import {
  getEventHandlerIDLAttribute,
  setEventHandlerIDLAttribute,
} from "./events.ts";
import type { IGlobalEventHandlers } from "../../interface.d.ts";

export class GlobalEventHandlers
  implements
    Omit<IGlobalEventHandlers, "addEventListener" | "removeEventListener"> {
  get onabort():
    | ((this: globalThis.GlobalEventHandlers, ev: UIEvent) => any)
    | null {
    throw new Error();
  }
  get onanimationcancel():
    | ((this: globalThis.GlobalEventHandlers, ev: AnimationEvent) => any)
    | null {
    throw new Error();
  }
  get onanimationend():
    | ((this: globalThis.GlobalEventHandlers, ev: AnimationEvent) => any)
    | null {
    throw new Error();
  }
  get onanimationiteration():
    | ((this: globalThis.GlobalEventHandlers, ev: AnimationEvent) => any)
    | null {
    throw new Error();
  }
  get onanimationstart():
    | ((this: globalThis.GlobalEventHandlers, ev: AnimationEvent) => any)
    | null {
    throw new Error();
  }
  get onauxclick():
    | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
    | null {
    throw new Error();
  }
  get onbeforeinput():
    | ((this: globalThis.GlobalEventHandlers, ev: InputEvent) => any)
    | null {
    throw new Error();
  }
  get onblur():
    | ((this: globalThis.GlobalEventHandlers, ev: FocusEvent) => any)
    | null {
    throw new Error();
  }
  get oncancel():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get oncanplay():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get oncanplaythrough():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onchange():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    return getEventHandlerIDLAttribute(this, "onchange") as any;
  }
  get onclick():
    | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
    | null {
    throw new Error();
  }
  get onclose():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get oncontextmenu():
    | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
    | null {
    throw new Error();
  }
  get oncopy():
    | ((this: globalThis.GlobalEventHandlers, ev: ClipboardEvent) => any)
    | null {
    throw new Error();
  }
  get oncuechange():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get oncut():
    | ((this: globalThis.GlobalEventHandlers, ev: ClipboardEvent) => any)
    | null {
    throw new Error();
  }
  get ondblclick():
    | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
    | null {
    throw new Error();
  }
  get ondrag():
    | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
    | null {
    throw new Error();
  }
  get ondragend():
    | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
    | null {
    throw new Error();
  }
  get ondragenter():
    | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
    | null {
    throw new Error();
  }
  get ondragleave():
    | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
    | null {
    throw new Error();
  }
  get ondragover():
    | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
    | null {
    throw new Error();
  }
  get ondragstart():
    | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
    | null {
    throw new Error();
  }
  get ondrop():
    | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
    | null {
    throw new Error();
  }
  get ondurationchange():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onemptied():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onended():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onerror(): OnErrorEventHandler {
    throw new Error();
  }
  get onfocus():
    | ((this: globalThis.GlobalEventHandlers, ev: FocusEvent) => any)
    | null {
    throw new Error();
  }
  get onformdata():
    | ((this: globalThis.GlobalEventHandlers, ev: FormDataEvent) => any)
    | null {
    throw new Error();
  }
  get ongotpointercapture():
    | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
    | null {
    throw new Error();
  }
  get oninput():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    return getEventHandlerIDLAttribute(this, "oninput") as any;
  }
  get oninvalid():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onkeydown():
    | ((this: globalThis.GlobalEventHandlers, ev: KeyboardEvent) => any)
    | null {
    throw new Error();
  }
  get onkeypress():
    | ((this: globalThis.GlobalEventHandlers, ev: KeyboardEvent) => any)
    | null {
    throw new Error();
  }
  get onkeyup():
    | ((this: globalThis.GlobalEventHandlers, ev: KeyboardEvent) => any)
    | null {
    throw new Error();
  }
  get onload():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    return getEventHandlerIDLAttribute(this, "onload") as any;
  }
  get onloadeddata():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onloadedmetadata():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onloadstart():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onlostpointercapture():
    | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
    | null {
    throw new Error();
  }
  get onmousedown():
    | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
    | null {
    throw new Error();
  }
  get onmouseenter():
    | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
    | null {
    throw new Error();
  }
  get onmouseleave():
    | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
    | null {
    throw new Error();
  }
  get onmousemove():
    | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
    | null {
    throw new Error();
  }
  get onmouseout():
    | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
    | null {
    throw new Error();
  }
  get onmouseover():
    | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
    | null {
    throw new Error();
  }
  get onmouseup():
    | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
    | null {
    throw new Error();
  }
  get onpaste():
    | ((this: globalThis.GlobalEventHandlers, ev: ClipboardEvent) => any)
    | null {
    throw new Error();
  }
  get onpause():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onplay():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onplaying():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onpointercancel():
    | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
    | null {
    throw new Error();
  }
  get onpointerdown():
    | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
    | null {
    throw new Error();
  }
  get onpointerenter():
    | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
    | null {
    throw new Error();
  }
  get onpointerleave():
    | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
    | null {
    throw new Error();
  }
  get onpointermove():
    | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
    | null {
    throw new Error();
  }
  get onpointerout():
    | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
    | null {
    throw new Error();
  }
  get onpointerover():
    | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
    | null {
    throw new Error();
  }
  get onpointerup():
    | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
    | null {
    throw new Error();
  }
  get onprogress():
    | ((this: globalThis.GlobalEventHandlers, ev: ProgressEvent) => any)
    | null {
    throw new Error();
  }
  get onratechange():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onreset():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onresize():
    | ((this: globalThis.GlobalEventHandlers, ev: UIEvent) => any)
    | null {
    throw new Error();
  }
  get onscroll():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onsecuritypolicyviolation():
    | ((
      this: globalThis.GlobalEventHandlers,
      ev: SecurityPolicyViolationEvent,
    ) => any)
    | null {
    throw new Error();
  }
  get onseeked():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onseeking():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onselect():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onselectionchange():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onselectstart():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onslotchange():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onstalled():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onsubmit():
    | ((this: globalThis.GlobalEventHandlers, ev: SubmitEvent) => any)
    | null {
    throw new Error();
  }
  get onsuspend():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get ontimeupdate():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get ontoggle():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get ontouchcancel():
    | ((this: globalThis.GlobalEventHandlers, ev: TouchEvent) => any)
    | null
    | undefined {
    throw new Error();
  }
  get ontouchend():
    | ((this: globalThis.GlobalEventHandlers, ev: TouchEvent) => any)
    | null
    | undefined {
    throw new Error();
  }
  get ontouchmove():
    | ((this: globalThis.GlobalEventHandlers, ev: TouchEvent) => any)
    | null
    | undefined {
    throw new Error();
  }
  get ontouchstart():
    | ((this: globalThis.GlobalEventHandlers, ev: TouchEvent) => any)
    | null
    | undefined {
    throw new Error();
  }
  get ontransitioncancel():
    | ((this: globalThis.GlobalEventHandlers, ev: TransitionEvent) => any)
    | null {
    throw new Error();
  }
  get ontransitionend():
    | ((this: globalThis.GlobalEventHandlers, ev: TransitionEvent) => any)
    | null {
    throw new Error();
  }
  get ontransitionrun():
    | ((this: globalThis.GlobalEventHandlers, ev: TransitionEvent) => any)
    | null {
    throw new Error();
  }
  get ontransitionstart():
    | ((this: globalThis.GlobalEventHandlers, ev: TransitionEvent) => any)
    | null {
    throw new Error();
  }
  get onvolumechange():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onwaiting():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onwebkitanimationend():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onwebkitanimationiteration():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onwebkitanimationstart():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onwebkittransitionend():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }
  get onwheel():
    | ((this: globalThis.GlobalEventHandlers, ev: WheelEvent) => any)
    | null {
    throw new Error();
  }

  get onscrollend():
    | ((this: globalThis.GlobalEventHandlers, ev: Event) => any)
    | null {
    throw new Error();
  }

  set onabort(
    value: ((this: globalThis.GlobalEventHandlers, ev: UIEvent) => any) | null,
  ) {
    throw new Error();
  }
  set onanimationcancel(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: AnimationEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onanimationend(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: AnimationEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onanimationiteration(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: AnimationEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onanimationstart(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: AnimationEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onauxclick(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onbeforeinput(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: InputEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onblur(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: FocusEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set oncancel(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set oncanplay(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set oncanplaythrough(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onchange(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    setEventHandlerIDLAttribute(this, "onchange", value);
  }
  set onclick(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
      | null,
  ) {
    setEventHandlerIDLAttribute(this, "onclick", value);
  }
  set onclose(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set oncontextmenu(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set oncopy(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: ClipboardEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set oncuechange(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set oncut(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: ClipboardEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ondblclick(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ondrag(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ondragend(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ondragenter(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ondragleave(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ondragover(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ondragstart(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ondrop(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: DragEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ondurationchange(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onemptied(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onended(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onerror(value: OnErrorEventHandler) {
    throw new Error();
  }
  set onfocus(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: FocusEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onformdata(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: FormDataEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ongotpointercapture(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set oninput(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    setEventHandlerIDLAttribute(this, "oninput", value);
  }
  set oninvalid(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onkeydown(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: KeyboardEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onkeypress(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: KeyboardEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onkeyup(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: KeyboardEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onload(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    setEventHandlerIDLAttribute(this, "onload", value);
  }
  set onloadeddata(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onloadedmetadata(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onloadstart(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onlostpointercapture(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onmousedown(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onmouseenter(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onmouseleave(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onmousemove(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onmouseout(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onmouseover(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onmouseup(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: MouseEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onpaste(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: ClipboardEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onpause(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onplay(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onplaying(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onpointercancel(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onpointerdown(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onpointerenter(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onpointerleave(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onpointermove(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onpointerout(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onpointerover(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onpointerup(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: PointerEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onprogress(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: ProgressEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onratechange(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onreset(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onresize(
    value: ((this: globalThis.GlobalEventHandlers, ev: UIEvent) => any) | null,
  ) {
    throw new Error();
  }
  set onscroll(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onsecuritypolicyviolation(
    value:
      | ((
        this: globalThis.GlobalEventHandlers,
        ev: SecurityPolicyViolationEvent,
      ) => any)
      | null,
  ) {
    throw new Error();
  }
  set onseeked(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onseeking(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onselect(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onselectionchange(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onselectstart(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onslotchange(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onstalled(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onsubmit(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: SubmitEvent) => any)
      | null,
  ) {
    setEventHandlerIDLAttribute(this, "onsubmit", value);
  }
  set onsuspend(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set ontimeupdate(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set ontoggle(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set ontouchcancel(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: TouchEvent) => any)
      | null
      | undefined,
  ) {
    throw new Error();
  }
  set ontouchend(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: TouchEvent) => any)
      | null
      | undefined,
  ) {
    throw new Error();
  }
  set ontouchmove(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: TouchEvent) => any)
      | null
      | undefined,
  ) {
    throw new Error();
  }
  set ontouchstart(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: TouchEvent) => any)
      | null
      | undefined,
  ) {
    throw new Error();
  }
  set ontransitioncancel(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: TransitionEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ontransitionend(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: TransitionEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ontransitionrun(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: TransitionEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set ontransitionstart(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: TransitionEvent) => any)
      | null,
  ) {
    throw new Error();
  }
  set onvolumechange(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onwaiting(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onwebkitanimationend(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onwebkitanimationiteration(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onwebkitanimationstart(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onwebkittransitionend(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
  set onwheel(
    value:
      | ((this: globalThis.GlobalEventHandlers, ev: WheelEvent) => any)
      | null,
  ) {
    throw new Error();
  }

  set onscrollend(
    value: ((this: globalThis.GlobalEventHandlers, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
}

export interface GlobalEventHandlers extends EventTarget {}
