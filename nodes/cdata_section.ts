import { Text } from "./text.ts";
import { ICDATASection } from "../interface.d.ts";

export class CDATASection extends Text implements ICDATASection {
  constructor() {
    super();
  }
}
