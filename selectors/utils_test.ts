import { attr, id, selectorToSelectorList } from "./utils.ts";
import { Case, Operator, SelectorList } from "./types.ts";
import { assertEquals, assertThrows, describe, it } from "../_dev_deps.ts";

import { createParser } from "npm:css-selector-parser@2.3.2";

const parser = createParser();

console.log(parser("div > div2 > div3"));

describe("astToSelectorList", () => {
  it("should return selector list", () => {
    const table: [string, SelectorList][] = [
      ["div", [[[
        [{ type: "type", value: "div" }],
      ]]]],
      [".class", [[[
        [{ type: "class", value: "class" }],
      ]]]],
      ["#id", [[[
        [{ type: "id", value: "id" }],
      ]]]],
      ["[name]", [[[
        [{ type: "attr", name: "name" }],
      ]]]],
      ["[name=value]", [[[
        [{
          type: "attr",
          name: "name",
          value: "value",
          operator: Operator.ExactEq,
        }],
      ]]]],
      ["[name~=value]", [[[
        [{
          type: "attr",
          name: "name",
          value: "value",
          operator: Operator.OneOf,
        }],
      ]]]],
      ["[name*=value]", [[[
        [{
          type: "attr",
          name: "name",
          value: "value",
          operator: Operator.PartOf,
        }],
      ]]]],
      ["[name^=value]", [[[
        [{
          type: "attr",
          name: "name",
          value: "value",
          operator: Operator.StartWith,
        }],
      ]]]],
      ["[name$=value]", [[[
        [{
          type: "attr",
          name: "name",
          value: "value",
          operator: Operator.EndWith,
        }],
      ]]]],
      ["[name|=value]", [[[
        [{
          type: "attr",
          name: "name",
          value: "value",
          operator: Operator.HyphenOf,
        }],
      ]]]],
      ["[name=value i]", [[[
        [{
          type: "attr",
          name: "name",
          value: "value",
          operator: Operator.ExactEq,
          case: Case.i,
        }],
      ]]]],
      ["[name=value s]", [[[
        [{
          type: "attr",
          name: "name",
          value: "value",
          operator: Operator.ExactEq,
          case: Case.s,
        }],
      ]]]],
      [":valid", [[[
        [{ type: "pseudo-class", value: "valid" }],
      ]]]],
      [":not(div)", [[[
        [{
          type: "pseudo-class",
          value: "not",
          argument: [{ type: "type", value: "div" }],
        }],
      ]]]],
      [":not(div, #id)", [[[
        [{
          type: "pseudo-class",
          value: "not",
          argument: [
            { type: "type", value: "div" },
            { type: "id", value: "id" },
          ],
        }],
      ]]]],
      ["div.class", [[[
        [{ type: "type", value: "div" }, { type: "class", value: "class" }],
      ]]]],
      ["div > div2", [[
        {
          combinator: { type: "descendant" },
          unit: [[{ type: "type", value: "div" }]],
        },
        [
          [{ type: "type", value: "div2" }],
        ],
      ]]],
      [".div > .div2", [[
        {
          combinator: { type: "descendant" },
          unit: [[{ type: "class", value: "div" }]],
        },
        [
          [{ type: "class", value: "div2" }],
        ],
      ]]],
    ];

    table.forEach(([selector, expected]) => {
      const ast = parser(selector);
      assertEquals(selectorToSelectorList(ast), expected);
    });
  });
});

describe("id", () => {
  it("should return IDSelector", () => {
    assertEquals(id("abc"), { type: "id", value: "abc" });
  });
});

describe("attr", () => {
  it("should return attribute selector with name", () => {
    assertEquals(attr({ name: "", type: "Attribute" }), {
      type: "attr",
      name: "",
    });
  });

  it("should return attribute selector with name and value", () => {
    assertEquals(
      attr({
        name: "a",
        type: "Attribute",
        operator: "=",
        value: { type: "String", value: "b" },
      }),
      {
        type: "attr",
        name: "a",
        value: "b",
        operator: Operator.ExactEq,
      },
    );
  });

  it("should throw error if the attribute is syntax error", () => {
    assertThrows(() => {
      attr({
        name: "",
        type: "Attribute",
        value: { type: "String", value: "" },
      });
    });
  });
});
