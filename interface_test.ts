/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { CharacterData as MyCharacterData } from "./nodes/character_data.ts";
import { CDATASection as MyCDATASection } from "./nodes/cdata_section.ts";
import { DocumentFragment as MyDocumentFragment } from "./nodes/document_fragment.ts";
import { DocumentType as MyDocumentType } from "./nodes/document_type.ts";
import { ProcessingInstruction as MyProcessingInstruction } from "./nodes/processing_instruction.ts";
import { ShadowRoot as MyShadowRoot } from "./nodes/shadow_root.ts";
import { Text as MyText } from "./nodes/text.ts";
import { Attr as MyAttr } from "./nodes/elements/attr.ts";
import { Element as MyElement } from "./nodes/elements/element.ts";
import { Comment as MyComment } from "./nodes/comment.ts";

import { assertType, IsExact } from "./_dev_deps.ts";

Deno.test("it should same constructor parameters", () => {
  assertType<
    IsExact<
      ConstructorParameters<typeof MyCharacterData>,
      ConstructorParameters<typeof CharacterData>
    >
  >(true);

  assertType<
    IsExact<
      ConstructorParameters<typeof MyCDATASection>,
      ConstructorParameters<typeof CDATASection>
    >
  >(true);

  assertType<
    IsExact<
      ConstructorParameters<typeof MyDocumentFragment>,
      ConstructorParameters<typeof DocumentFragment>
    >
  >(true);

  assertType<
    IsExact<
      ConstructorParameters<typeof MyDocumentType>,
      ConstructorParameters<typeof DocumentType>
    >
  >(true);

  assertType<
    IsExact<
      ConstructorParameters<typeof MyProcessingInstruction>,
      ConstructorParameters<typeof ProcessingInstruction>
    >
  >(true);

  assertType<
    IsExact<
      ConstructorParameters<typeof MyShadowRoot>,
      ConstructorParameters<typeof ShadowRoot>
    >
  >(true);

  assertType<
    IsExact<
      ConstructorParameters<typeof MyText>,
      ConstructorParameters<typeof Text>
    >
  >(true);

  assertType<
    IsExact<
      ConstructorParameters<typeof MyAttr>,
      ConstructorParameters<typeof Attr>
    >
  >(true);

  assertType<
    IsExact<
      ConstructorParameters<typeof MyElement>,
      ConstructorParameters<typeof Element>
    >
  >(true);

  assertType<
    IsExact<
      ConstructorParameters<typeof MyComment>,
      ConstructorParameters<typeof Text>
    >
  >(true);
});
