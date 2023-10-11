import { type IElement } from "../../../interface.d.ts";

type IElement_CSSShadowParts = Pick<IElement, "part">;

export class Element implements IElement_CSSShadowParts {
  get part(): DOMTokenList {
    throw new Error("part");
  }
}
