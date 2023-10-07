interface IDocument_Storage_Access_API
  extends Pick<Document, "hasStorageAccess" | "requestStorageAccess"> {}

export class Document implements IDocument_Storage_Access_API {
  hasStorageAccess(): Promise<boolean> {
    throw new Error();
  }

  requestStorageAccess(): Promise<void> {
    throw new Error();
  }
}
