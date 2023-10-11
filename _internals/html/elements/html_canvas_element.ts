import type { IHTMLCanvasElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLCanvasElement")
export class HTMLCanvasElement extends HTMLElement
  implements IHTMLCanvasElement {
  get height(): number {
    throw new Error("height#getter");
  }

  set height(value: number) {
    throw new Error("height#setter");
  }

  get width(): number {
    throw new Error("width#getter");
  }

  set width(value: number) {
    throw new Error("width#setter");
  }

  captureStream(frameRequestRate?: number | undefined): MediaStream {
    throw new Error("captureStream");
  }

  getContext(
    contextId: "2d",
    options?: CanvasRenderingContext2DSettings | undefined,
  ): CanvasRenderingContext2D | null;
  getContext(
    contextId: "bitmaprenderer",
    options?: ImageBitmapRenderingContextSettings | undefined,
  ): ImageBitmapRenderingContext | null;
  getContext(
    contextId: "webgl",
    options?: WebGLContextAttributes | undefined,
  ): WebGLRenderingContext | null;
  getContext(
    contextId: "webgl2",
    options?: WebGLContextAttributes | undefined,
  ): WebGL2RenderingContext | null;
  getContext(contextId: string, options?: any): RenderingContext | null;
  getContext(contextId: unknown, options?: unknown): RenderingContext | null {
    throw new Error("getContext");
  }

  toBlob(
    callback: BlobCallback,
    type?: string | undefined,
    quality?: any,
  ): void {
    throw new Error("toBlob");
    throw new Error("toBlob");
  }

  toDataURL(type?: string | undefined, quality?: any): string {
    throw new Error("toDataURL");
  }

  transferControlToOffscreen(): OffscreenCanvas {
    throw new Error("transferControlToOffscreen");
  }
}
