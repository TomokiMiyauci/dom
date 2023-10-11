import { matchComplexSelector, matchSimpleSelector } from "./hook.ts";
import { ComplexSelector } from "./types.ts";
import {
  assert,
  assertFalse,
  assertThrows,
  describe,
  it,
} from "../../_dev_deps.ts";
import { Document } from "../../nodes/document.ts";
import { Operator } from "./types.ts";

const document = new Document();

describe("matchComplexSelector", () => {
  it("should", () => {
    const parent = document.createElement("div");
    const child = parent.appendChild(document.createElement("span"));

    const selector: ComplexSelector = [
      {
        combinator: { type: "descendant" },
        unit: [[{ type: "type", value: "div" }]],
      },
      [
        [{ type: "type", value: "span" }],
      ],
    ];

    assert(matchComplexSelector(selector, child));
    assertFalse(matchComplexSelector(selector, parent));
  });
});

describe("matchSimpleSelector", () => {
  it("should match with id selector", () => {
    const element = document.createElement("div");
    element.id = "a";

    assert(matchSimpleSelector({ type: "id", value: "a" }, element));
  });

  describe("universal selector", () => {
    it("should match", () => {
      const element = document.createElement("div");

      assert(matchSimpleSelector({ type: "universal" }, element));
    });
  });

  describe("type selector", () => {
    it("should match", () => {
      const element = document.createElement("div");

      assert(matchSimpleSelector({ type: "type", value: "div" }, element));
    });

    it("should not match", () => {
      const element = document.createElement("span");

      assertFalse(matchSimpleSelector({ type: "type", value: "div" }, element));
    });
  });

  describe("class selector", () => {
    it("should match", () => {
      const element = document.createElement("div");
      element.className = "a";

      assert(matchSimpleSelector({ type: "class", value: "a" }, element));
    });

    it("should match with multiple class name", () => {
      const element = document.createElement("div");
      element.className = "a b";

      assert(matchSimpleSelector({ type: "class", value: "b" }, element));
    });

    it("should not match", () => {
      const element = document.createElement("span");
      element.className = "b";

      assertFalse(matchSimpleSelector({ type: "class", value: "a" }, element));
    });
  });

  describe("attribute selector", () => {
    it("should match with attribute name only", () => {
      const element = document.createElement("div");
      element.setAttribute("a", "b");

      assert(matchSimpleSelector({ type: "attr", name: "a" }, element));
    });

    it("should match with attribute name and value", () => {
      const element = document.createElement("div");
      element.setAttribute("a", "b");

      assert(
        matchSimpleSelector({
          type: "attr",
          name: "a",
          value: "b",
          operator: Operator.ExactEq,
        }, element),
      );
    });

    describe("Operator(~=)", () => {
      it("should match with single attribute value", () => {
        const element = document.createElement("div");
        element.setAttribute("a", "b");

        assert(
          matchSimpleSelector({
            type: "attr",
            name: "a",
            value: "b",
            operator: Operator.OneOf,
          }, element),
        );
      });

      it("should match with multiple attribute value", () => {
        const element = document.createElement("div");
        element.setAttribute("a", "b c d");

        assert(
          matchSimpleSelector({
            type: "attr",
            name: "a",
            value: "c",
            operator: Operator.OneOf,
          }, element),
        );
      });

      it("should not match", () => {
        const element = document.createElement("div");
        element.setAttribute("a", "b c d");

        assertFalse(
          matchSimpleSelector({
            type: "attr",
            name: "a",
            value: "c d",
            operator: Operator.OneOf,
          }, element),
        );
      });
    });

    describe("Operator(|=)", () => {
      it("should match exact equal", () => {
        const element = document.createElement("div");
        element.setAttribute("a", "b");

        assert(
          matchSimpleSelector({
            type: "attr",
            name: "a",
            value: "b",
            operator: Operator.HyphenOf,
          }, element),
        );
      });

      it("should match with hyphen", () => {
        const element = document.createElement("div");
        element.setAttribute("a", "b-");

        assert(
          matchSimpleSelector({
            type: "attr",
            name: "a",
            value: "b",
            operator: Operator.HyphenOf,
          }, element),
        );
      });

      it("should not match", () => {
        const element = document.createElement("div");
        element.setAttribute("a", "b");

        assertFalse(
          matchSimpleSelector({
            type: "attr",
            name: "a",
            value: "c",
            operator: Operator.HyphenOf,
          }, element),
        );
      });

      it("should not match", () => {
        const element = document.createElement("div");
        element.setAttribute("a", "b-");

        assertFalse(
          matchSimpleSelector({
            type: "attr",
            name: "a",
            value: "-",
            operator: Operator.HyphenOf,
          }, element),
        );
      });
    });

    describe("Operator(^=)", () => {
      it("should match exactly", () => {
        const element = document.createElement("div");
        element.setAttribute("a", "b");

        assert(
          matchSimpleSelector({
            type: "attr",
            name: "a",
            value: "b",
            operator: Operator.StartWith,
          }, element),
        );
      });

      it("should match start with", () => {
        const element = document.createElement("div");
        element.setAttribute("a", "abc");

        assert(
          matchSimpleSelector({
            type: "attr",
            name: "a",
            value: "ab",
            operator: Operator.StartWith,
          }, element),
        );
      });
    });

    it("should match with attribute name and value with =", () => {
      const element = document.createElement("div");
      element.setAttribute("a", "b");

      assert(
        matchSimpleSelector({
          type: "attr",
          name: "a",
          value: "b",
          operator: Operator.ExactEq,
        }, element),
      );
    });

    it("should match with attribute name and value with =", () => {
      const element = document.createElement("div");
      element.setAttribute("a", "b");

      assert(
        matchSimpleSelector({
          type: "attr",
          name: "a",
          value: "b",
          operator: Operator.ExactEq,
        }, element),
      );
    });

    it("should throw if the operator is unknown", () => {
      const element = document.createElement("div");
      element.setAttribute("a", "b");

      assertThrows(() =>
        matchSimpleSelector({
          type: "attr",
          name: "a",
          operator: Operator.Unknown,
        }, element)
      );
    });
  });

  describe("pseudo selector", () => {
    describe("not", () => {
      it(":not(div) should match to not div element", () => {
        const element = document.createElement("span");

        assert(
          matchSimpleSelector({
            type: "pseudo-class",
            value: "not",
            argument: [{ type: "type", value: "div" }],
          }, element),
        );
      });

      it(":not(div) should match to not div element", () => {
        const element = document.createElement("div");

        assertFalse(
          matchSimpleSelector({
            type: "pseudo-class",
            value: "not",
            argument: [{ type: "type", value: "div" }],
          }, element),
        );
      });
    });
  });
});
