import type { IHTMLMediaElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLMediaElement extends HTMLElement implements IHTMLMediaElement {
  get autoplay(): boolean {
    throw new Error("autoplay#getter");
  }

  set autoplay(value: boolean) {
    throw new Error("autoplay#getter");
  }

  get buffered(): TimeRanges {
    throw new Error("buffered#getter");
  }

  get controls(): boolean {
    throw new Error("controls#getter");
  }

  set controls(value: boolean) {
    throw new Error("controls#getter");
  }

  get crossOrigin(): string | null {
    throw new Error("crossOrigin#getter");
  }

  set crossOrigin(value: string | null) {
    throw new Error("crossOrigin#getter");
  }

  get currentSrc(): string {
    throw new Error("currentSrc#getter");
  }

  get currentTime(): number {
    throw new Error("currentTime#getter");
  }

  set currentTime(value: number) {
    throw new Error("currentTime#getter");
  }

  get defaultMuted(): boolean {
    throw new Error("defaultMuted#getter");
  }

  set defaultMuted(value: boolean) {
    throw new Error("defaultMuted#getter");
  }

  get defaultPlaybackRate(): number {
    throw new Error("defaultPlaybackRate#getter");
  }

  set defaultPlaybackRate(value: number) {
    throw new Error("defaultPlaybackRate#getter");
  }

  get disableRemotePlayback(): boolean {
    throw new Error("disableRemotePlayback#getter");
  }

  set disableRemotePlayback(value: boolean) {
    throw new Error("disableRemotePlayback#getter");
  }

  get duration(): number {
    throw new Error("duration#getter");
  }

  get ended(): boolean {
    throw new Error("ended#getter");
  }

  get error(): MediaError | null {
    throw new Error("error#getter");
  }

  get loop(): boolean {
    throw new Error("loop#getter");
  }

  set loop(value: boolean) {
    throw new Error("loop#getter");
  }

  get mediaKeys(): MediaKeys | null {
    throw new Error("mediaKeys#getter");
  }

  get muted(): boolean {
    throw new Error("muted#getter");
  }

  set muted(value: boolean) {
    throw new Error("muted#getter");
  }

  get networkState(): number {
    throw new Error("networkState#getter");
  }

  get onencrypted():
    | ((this: globalThis.HTMLMediaElement, ev: MediaEncryptedEvent) => any)
    | null {
    throw new Error("onencrypted#getter");
  }

  set onencrypted(
    value:
      | ((this: HTMLMediaElement, ev: MediaEncryptedEvent) => any)
      | null,
  ) {
    throw new Error("onencrypted#setter");
  }

  get onwaitingforkey():
    | ((this: globalThis.HTMLMediaElement, ev: Event) => any)
    | null {
    throw new Error("onwaitingforkey#getter");
  }

  set onwaitingforkey(
    value:
      | ((this: HTMLMediaElement, ev: Event) => any)
      | null,
  ) {
    throw new Error("onwaitingforkey#setter");
  }

  get paused(): boolean {
    throw new Error("paused#getter");
  }

  get playbackRate(): number {
    throw new Error("playbackRate#getter");
  }

  set playbackRate(
    value: number,
  ) {
    throw new Error("playbackRate#setter");
  }

  get played(): TimeRanges {
    throw new Error("played#getter");
  }

  get preload(): "none" | "metadata" | "auto" | "" {
    throw new Error("preload#getter");
  }

  set preload(value: "none" | "metadata" | "auto" | "") {
    throw new Error("preload#getter");
  }

  get preservesPitch(): boolean {
    throw new Error("preservesPitch#getter");
  }

  set preservesPitch(value: boolean) {
    throw new Error("preservesPitch#getter");
  }

  get readyState(): number {
    throw new Error("readyState#getter");
  }

  get remote(): RemotePlayback {
    throw new Error("remote#getter");
  }

  get seekable(): TimeRanges {
    throw new Error("seekable#getter");
  }

  get seeking(): boolean {
    throw new Error("seeking#getter");
  }

  get src(): string {
    throw new Error("src#getter");
  }

  set src(value: string) {
    throw new Error("src#setter");
  }

  get srcObject(): MediaProvider | null {
    throw new Error("srcObject#getter");
  }

  set srcObject(value: MediaProvider | null) {
    throw new Error("srcObject#setter");
  }

  get textTracks(): TextTrackList {
    throw new Error("textTracks#getter");
  }

  get volume(): number {
    throw new Error("volume#getter");
  }

  set volume(value: number) {
    throw new Error("volume#setter");
  }

  addTextTrack(
    kind: TextTrackKind,
    label?: string,
    language?: string,
  ): TextTrack {
    throw new Error("addTextTrack");
  }

  canPlayType(type: string): CanPlayTypeResult {
    throw new Error("canPlayType");
  }

  fastSeek(time: number): void {
    throw new Error("fastSeek");
  }

  load(): void {
    throw new Error("load");
  }

  pause(): void {
    throw new Error("pause");
  }

  play(): Promise<void> {
    throw new Error("pause");
  }

  setMediaKeys(mediaKeys: MediaKeys | null): Promise<void> {
    throw new Error("setMediaKeys");
  }

  readonly NETWORK_EMPTY = 0;
  readonly NETWORK_IDLE = 1;
  readonly NETWORK_LOADING = 2;
  readonly NETWORK_NO_SOURCE = 3;
  readonly HAVE_NOTHING = 0;
  readonly HAVE_METADATA = 1;
  readonly HAVE_CURRENT_DATA = 2;
  readonly HAVE_FUTURE_DATA = 3;
  readonly HAVE_ENOUGH_DATA = 4;
}
