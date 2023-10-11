import type { IHTMLVideoElement } from "../../../interface.d.ts";
import { HTMLMediaElement } from "./html_media_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLVideoElement")
export class HTMLVideoElement extends HTMLMediaElement
  implements IHTMLVideoElement {
  get disablePictureInPicture(): boolean {
    throw new Error("disablePictureInPicture#getter");
  }
  set disablePictureInPicture(value: boolean) {
    throw new Error("disablePictureInPicture#setter");
  }

  get height(): number {
    throw new Error("height#getter");
  }
  set height(value: number) {
    throw new Error("height#setter");
  }

  get onenterpictureinpicture():
    | ((this: globalThis.HTMLVideoElement, ev: Event) => any)
    | null {
    throw new Error("onenterpictureinpicture#getter");
  }

  set onenterpictureinpicture(
    value: ((this: globalThis.HTMLVideoElement, ev: Event) => any) | null,
  ) {
    throw new Error("onenterpictureinpicture#setter");
  }

  get onleavepictureinpicture():
    | ((this: globalThis.HTMLVideoElement, ev: Event) => any)
    | null {
    throw new Error("onleavepictureinpicture#getter");
  }

  set onleavepictureinpicture(
    value: ((this: globalThis.HTMLVideoElement, ev: Event) => any) | null,
  ) {
    throw new Error("onleavepictureinpicture#setter");
  }

  get playsInline(): boolean {
    throw new Error("playsInline#getter");
  }
  set playsInline(value: boolean) {
    throw new Error("playsInline#setter");
  }

  get poster(): string {
    throw new Error("poster#getter");
  }
  set poster(value: string) {
    throw new Error("poster#setter");
  }

  get videoHeight(): number {
    throw new Error("videoHeight");
  }

  get videoWidth(): number {
    throw new Error("videoWidth");
  }

  get width(): number {
    throw new Error("width#getter");
  }
  set width(value: number) {
    throw new Error("width#setter");
  }
  cancelVideoFrameCallback(handle: number): void {
    throw new Error("cancelVideoFrameCallback");
  }

  getVideoPlaybackQuality(): VideoPlaybackQuality {
    throw new Error("getVideoPlaybackQuality");
  }

  requestPictureInPicture(): Promise<PictureInPictureWindow> {
    throw new Error("requestPictureInPicture");
  }
  requestVideoFrameCallback(callback: VideoFrameRequestCallback): number {
    throw new Error("requestVideoFrameCallback");
  }
}
