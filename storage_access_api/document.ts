import { type Constructor } from "../deps.ts";

interface IDocument_Storage_Access_API
  extends Pick<Document, "hasStorageAccess" | "requestStorageAccess"> {}

export function Document_Storage_Access_API<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements IDocument_Storage_Access_API {
    hasStorageAccess(): Promise<boolean> {
      throw new Error();
    }

    requestStorageAccess(): Promise<void> {
      throw new Error();
    }
  }

  return Mixin;
}

export interface Document_Storage_Access_API
  extends IDocument_Storage_Access_API {}
