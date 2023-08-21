import { Constructor } from "../deps.ts";
import type { IHTMLHyperlinkElementUtils } from "../interface.d.ts";

export function HTMLHyperlinkElementUtils<T extends Constructor>(Ctor: T) {
  abstract class HTMLHyperlinkElementUtils extends Ctor
    implements IHTMLHyperlinkElementUtils {
    get hash(): string {
      throw new Error("hash#getter");
    }

    set hash(value: string) {
      throw new Error("hash#setter");
    }

    get host(): string {
      throw new Error("host#getter");
    }

    set host(value: string) {
      throw new Error("host#setter");
    }

    get hostname(): string {
      throw new Error("hostname#getter");
    }

    set hostname(value: string) {
      throw new Error("hostname#setter");
    }

    get href(): string {
      throw new Error("href#getter");
    }

    set href(value: string) {
      throw new Error("href#setter");
    }

    get origin(): string {
      throw new Error("origin#getter");
    }

    get password(): string {
      throw new Error("password#getter");
    }

    set password(value: string) {
      throw new Error("password#setter");
    }

    get port(): string {
      throw new Error("port#getter");
    }

    set port(value: string) {
      throw new Error("port#setter");
    }

    get pathname(): string {
      throw new Error("pathname#getter");
    }

    set pathname(value: string) {
      throw new Error("pathname#setter");
    }

    get protocol(): string {
      throw new Error("protocol#getter");
    }

    set protocol(value: string) {
      throw new Error("protocol#setter");
    }

    get search(): string {
      throw new Error("search#getter");
    }

    set search(value: string) {
      throw new Error("search#setter");
    }

    get username(): string {
      throw new Error("username#getter");
    }

    set username(value: string) {
      throw new Error("username#setter");
    }
  }

  return HTMLHyperlinkElementUtils;
}

// deno-lint-ignore no-empty-interface
export interface HTMLHyperlinkElementUtils extends IHTMLHyperlinkElementUtils {}
