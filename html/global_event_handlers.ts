import { type Constructor } from "../deps.ts";
import type { IGlobalEventHandlers } from "../interface.d.ts";

export function GlobalEventHandlers<T extends Constructor>(Ctor: T) {
  return class extends Ctor implements IGlobalEventHandlers {
    get onabort(): ((this: GlobalEventHandlers, ev: UIEvent) => any) | null {
      throw new Error();
    }
    get onanimationcancel():
      | ((this: GlobalEventHandlers, ev: AnimationEvent) => any)
      | null {
      throw new Error();
    }
    get onanimationend():
      | ((this: GlobalEventHandlers, ev: AnimationEvent) => any)
      | null {
      throw new Error();
    }
    get onanimationiteration():
      | ((this: GlobalEventHandlers, ev: AnimationEvent) => any)
      | null {
      throw new Error();
    }
    get onanimationstart():
      | ((this: GlobalEventHandlers, ev: AnimationEvent) => any)
      | null {
      throw new Error();
    }
    get onauxclick():
      | ((this: GlobalEventHandlers, ev: MouseEvent) => any)
      | null {
      throw new Error();
    }
    get onbeforeinput():
      | ((this: GlobalEventHandlers, ev: InputEvent) => any)
      | null {
      throw new Error();
    }
    get onblur(): ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null {
      throw new Error();
    }
    get oncancel(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get oncanplay(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get oncanplaythrough():
      | ((this: GlobalEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }
    get onchange(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onclick(): ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null {
      throw new Error();
    }
    get onclose(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get oncontextmenu():
      | ((this: GlobalEventHandlers, ev: MouseEvent) => any)
      | null {
      throw new Error();
    }
    get oncopy():
      | ((this: GlobalEventHandlers, ev: ClipboardEvent) => any)
      | null {
      throw new Error();
    }
    get oncuechange(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get oncut():
      | ((this: GlobalEventHandlers, ev: ClipboardEvent) => any)
      | null {
      throw new Error();
    }
    get ondblclick():
      | ((this: GlobalEventHandlers, ev: MouseEvent) => any)
      | null {
      throw new Error();
    }
    get ondrag(): ((this: GlobalEventHandlers, ev: DragEvent) => any) | null {
      throw new Error();
    }
    get ondragend():
      | ((this: GlobalEventHandlers, ev: DragEvent) => any)
      | null {
      throw new Error();
    }
    get ondragenter():
      | ((this: GlobalEventHandlers, ev: DragEvent) => any)
      | null {
      throw new Error();
    }
    get ondragleave():
      | ((this: GlobalEventHandlers, ev: DragEvent) => any)
      | null {
      throw new Error();
    }
    get ondragover():
      | ((this: GlobalEventHandlers, ev: DragEvent) => any)
      | null {
      throw new Error();
    }
    get ondragstart():
      | ((this: GlobalEventHandlers, ev: DragEvent) => any)
      | null {
      throw new Error();
    }
    get ondrop(): ((this: GlobalEventHandlers, ev: DragEvent) => any) | null {
      throw new Error();
    }
    get ondurationchange():
      | ((this: GlobalEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }
    get onemptied(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onended(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onerror(): OnErrorEventHandler {
      throw new Error();
    }
    get onfocus(): ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null {
      throw new Error();
    }
    get onformdata():
      | ((this: GlobalEventHandlers, ev: FormDataEvent) => any)
      | null {
      throw new Error();
    }
    get ongotpointercapture():
      | ((this: GlobalEventHandlers, ev: PointerEvent) => any)
      | null {
      throw new Error();
    }
    get oninput(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get oninvalid(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onkeydown():
      | ((this: GlobalEventHandlers, ev: KeyboardEvent) => any)
      | null {
      throw new Error();
    }
    get onkeypress():
      | ((this: GlobalEventHandlers, ev: KeyboardEvent) => any)
      | null {
      throw new Error();
    }
    get onkeyup():
      | ((this: GlobalEventHandlers, ev: KeyboardEvent) => any)
      | null {
      throw new Error();
    }
    get onload(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onloadeddata(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onloadedmetadata():
      | ((this: GlobalEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }
    get onloadstart(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onlostpointercapture():
      | ((this: GlobalEventHandlers, ev: PointerEvent) => any)
      | null {
      throw new Error();
    }
    get onmousedown():
      | ((this: GlobalEventHandlers, ev: MouseEvent) => any)
      | null {
      throw new Error();
    }
    get onmouseenter():
      | ((this: GlobalEventHandlers, ev: MouseEvent) => any)
      | null {
      throw new Error();
    }
    get onmouseleave():
      | ((this: GlobalEventHandlers, ev: MouseEvent) => any)
      | null {
      throw new Error();
    }
    get onmousemove():
      | ((this: GlobalEventHandlers, ev: MouseEvent) => any)
      | null {
      throw new Error();
    }
    get onmouseout():
      | ((this: GlobalEventHandlers, ev: MouseEvent) => any)
      | null {
      throw new Error();
    }
    get onmouseover():
      | ((this: GlobalEventHandlers, ev: MouseEvent) => any)
      | null {
      throw new Error();
    }
    get onmouseup():
      | ((this: GlobalEventHandlers, ev: MouseEvent) => any)
      | null {
      throw new Error();
    }
    get onpaste():
      | ((this: GlobalEventHandlers, ev: ClipboardEvent) => any)
      | null {
      throw new Error();
    }
    get onpause(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onplay(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onplaying(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onpointercancel():
      | ((this: GlobalEventHandlers, ev: PointerEvent) => any)
      | null {
      throw new Error();
    }
    get onpointerdown():
      | ((this: GlobalEventHandlers, ev: PointerEvent) => any)
      | null {
      throw new Error();
    }
    get onpointerenter():
      | ((this: GlobalEventHandlers, ev: PointerEvent) => any)
      | null {
      throw new Error();
    }
    get onpointerleave():
      | ((this: GlobalEventHandlers, ev: PointerEvent) => any)
      | null {
      throw new Error();
    }
    get onpointermove():
      | ((this: GlobalEventHandlers, ev: PointerEvent) => any)
      | null {
      throw new Error();
    }
    get onpointerout():
      | ((this: GlobalEventHandlers, ev: PointerEvent) => any)
      | null {
      throw new Error();
    }
    get onpointerover():
      | ((this: GlobalEventHandlers, ev: PointerEvent) => any)
      | null {
      throw new Error();
    }
    get onpointerup():
      | ((this: GlobalEventHandlers, ev: PointerEvent) => any)
      | null {
      throw new Error();
    }
    get onprogress():
      | ((this: GlobalEventHandlers, ev: ProgressEvent) => any)
      | null {
      throw new Error();
    }
    get onratechange(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onreset(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onresize(): ((this: GlobalEventHandlers, ev: UIEvent) => any) | null {
      throw new Error();
    }
    get onscroll(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onsecuritypolicyviolation():
      | ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any)
      | null {
      throw new Error();
    }
    get onseeked(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onseeking(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onselect(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onselectionchange():
      | ((this: GlobalEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }
    get onselectstart():
      | ((this: GlobalEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }
    get onslotchange(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onstalled(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onsubmit():
      | ((this: GlobalEventHandlers, ev: SubmitEvent) => any)
      | null {
      throw new Error();
    }
    get onsuspend(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get ontimeupdate(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get ontoggle(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get ontouchcancel():
      | ((this: GlobalEventHandlers, ev: TouchEvent) => any)
      | null
      | undefined {
      throw new Error();
    }
    get ontouchend():
      | ((this: GlobalEventHandlers, ev: TouchEvent) => any)
      | null
      | undefined {
      throw new Error();
    }
    get ontouchmove():
      | ((this: GlobalEventHandlers, ev: TouchEvent) => any)
      | null
      | undefined {
      throw new Error();
    }
    get ontouchstart():
      | ((this: GlobalEventHandlers, ev: TouchEvent) => any)
      | null
      | undefined {
      throw new Error();
    }
    get ontransitioncancel():
      | ((this: GlobalEventHandlers, ev: TransitionEvent) => any)
      | null {
      throw new Error();
    }
    get ontransitionend():
      | ((this: GlobalEventHandlers, ev: TransitionEvent) => any)
      | null {
      throw new Error();
    }
    get ontransitionrun():
      | ((this: GlobalEventHandlers, ev: TransitionEvent) => any)
      | null {
      throw new Error();
    }
    get ontransitionstart():
      | ((this: GlobalEventHandlers, ev: TransitionEvent) => any)
      | null {
      throw new Error();
    }
    get onvolumechange():
      | ((this: GlobalEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }
    get onwaiting(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }
    get onwebkitanimationend():
      | ((this: GlobalEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }
    get onwebkitanimationiteration():
      | ((this: GlobalEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }
    get onwebkitanimationstart():
      | ((this: GlobalEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }
    get onwebkittransitionend():
      | ((this: GlobalEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }
    get onwheel(): ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null {
      throw new Error();
    }

    set onabort(
      value: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onanimationcancel(
      value: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onanimationend(
      value: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onanimationiteration(
      value: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onanimationstart(
      value: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onauxclick(
      value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onbeforeinput(
      value: ((this: GlobalEventHandlers, ev: InputEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onblur(
      value: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null,
    ) {
      throw new Error();
    }
    set oncancel(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set oncanplay(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set oncanplaythrough(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onchange(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onclick(
      value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onclose(value: ((this: GlobalEventHandlers, ev: Event) => any) | null) {
      throw new Error();
    }
    set oncontextmenu(
      value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null,
    ) {
      throw new Error();
    }
    set oncopy(
      value: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null,
    ) {
      throw new Error();
    }
    set oncuechange(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set oncut(
      value: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ondblclick(
      value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ondrag(
      value: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ondragend(
      value: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ondragenter(
      value: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ondragleave(
      value: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ondragover(
      value: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ondragstart(
      value: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ondrop(
      value: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ondurationchange(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onemptied(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onended(value: ((this: GlobalEventHandlers, ev: Event) => any) | null) {
      throw new Error();
    }
    set onerror(value: OnErrorEventHandler) {
      throw new Error();
    }
    set onfocus(
      value: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onformdata(
      value: ((this: GlobalEventHandlers, ev: FormDataEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ongotpointercapture(
      value: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null,
    ) {
      throw new Error();
    }
    set oninput(value: ((this: GlobalEventHandlers, ev: Event) => any) | null) {
      throw new Error();
    }
    set oninvalid(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onkeydown(
      value: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onkeypress(
      value: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onkeyup(
      value: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onload(value: ((this: GlobalEventHandlers, ev: Event) => any) | null) {
      throw new Error();
    }
    set onloadeddata(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onloadedmetadata(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onloadstart(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onlostpointercapture(
      value: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onmousedown(
      value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onmouseenter(
      value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onmouseleave(
      value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onmousemove(
      value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onmouseout(
      value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onmouseover(
      value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onmouseup(
      value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onpaste(
      value: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onpause(value: ((this: GlobalEventHandlers, ev: Event) => any) | null) {
      throw new Error();
    }
    set onplay(value: ((this: GlobalEventHandlers, ev: Event) => any) | null) {
      throw new Error();
    }
    set onplaying(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onpointercancel(
      value: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onpointerdown(
      value: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onpointerenter(
      value: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onpointerleave(
      value: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onpointermove(
      value: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onpointerout(
      value: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onpointerover(
      value: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onpointerup(
      value: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onprogress(
      value: ((this: GlobalEventHandlers, ev: ProgressEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onratechange(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onreset(value: ((this: GlobalEventHandlers, ev: Event) => any) | null) {
      throw new Error();
    }
    set onresize(
      value: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onscroll(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onsecuritypolicyviolation(
      value:
        | ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any)
        | null,
    ) {
      throw new Error();
    }
    set onseeked(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onseeking(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onselect(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onselectionchange(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onselectstart(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onslotchange(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onstalled(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onsubmit(
      value: ((this: GlobalEventHandlers, ev: SubmitEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onsuspend(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set ontimeupdate(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set ontoggle(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set ontouchcancel(
      value:
        | ((this: GlobalEventHandlers, ev: TouchEvent) => any)
        | null
        | undefined,
    ) {
      throw new Error();
    }
    set ontouchend(
      value:
        | ((this: GlobalEventHandlers, ev: TouchEvent) => any)
        | null
        | undefined,
    ) {
      throw new Error();
    }
    set ontouchmove(
      value:
        | ((this: GlobalEventHandlers, ev: TouchEvent) => any)
        | null
        | undefined,
    ) {
      throw new Error();
    }
    set ontouchstart(
      value:
        | ((this: GlobalEventHandlers, ev: TouchEvent) => any)
        | null
        | undefined,
    ) {
      throw new Error();
    }
    set ontransitioncancel(
      value: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ontransitionend(
      value: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ontransitionrun(
      value: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null,
    ) {
      throw new Error();
    }
    set ontransitionstart(
      value: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null,
    ) {
      throw new Error();
    }
    set onvolumechange(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onwaiting(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onwebkitanimationend(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onwebkitanimationiteration(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onwebkitanimationstart(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onwebkittransitionend(
      value: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }
    set onwheel(
      value: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null,
    ) {
      throw new Error();
    }

    addEventListener<K extends keyof GlobalEventHandlersEventMap>(
      type: K,
      listener: (
        this: GlobalEventHandlers,
        ev: GlobalEventHandlersEventMap[K],
      ) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof GlobalEventHandlersEventMap>(
      type: K,
      listener: (
        this: GlobalEventHandlers,
        ev: GlobalEventHandlersEventMap[K],
      ) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;
  };
}

// deno-lint-ignore no-empty-interface
export interface GlobalEventHandlers extends IGlobalEventHandlers {}
