# dom

The DOM reference implementation.

This is an implementation that strictly adheres to the DOM specifications
([whatwg/dom](https://dom.spec.whatwg.org/) and
[wpt/dom](https://github.com/web-platform-tests/wpt/tree/master/dom)).

Current status: test pass 46219/?

## Background

No library has been found that attempts to be compliant with the `DOM`
specification. Of the several libraries available,
[jsdom](https://github.com/jsdom/jsdom) is the closest to the specification, but
it does not behave as specified.

The `DOM` has a [specification](https://dom.spec.whatwg.org/). Therefore, an
implementation that adheres to the specification is required.

[Web platform test(wpt)](https://github.com/web-platform-tests/wpt) is a testing
platform for any Web API, including the `DOM`.

For this project, passing wpt tests is considered conformance to the
specification.

## Install

```ts
import * as mod from "https://deno.land/x/dom_std/mod.ts";
```

TODO: npm publish

npm:

```bash
npm i dom-std
```

## Usage

Use a stand-alone `Document` object.

```ts
import { Document, Element } from "https://deno.land/x/dom_std/mod.ts";
import { assertEquals } from "https://deno.land/std/assert/assert_equals.ts";
import { assert } from "https://deno.land/std/assert/assert.ts";

const document = new Document();
const div = document.createElement("div");

assertEquals(div.namespaceURI, null);
assert(div instanceof Element);
```

### Private data

The specification defines each member's private data with the expression
"associate".

To access private data, use the accessor.

```ts
import { $, Document } from "https://deno.land/x/dom_std/mod.ts";
import { assertEquals } from "https://deno.land/std/assert/assert_equals.ts";

const document = new Document();
$(document).type = "html";
const div = document.createElement("div");

assertEquals(div.namespaceURI, "http://www.w3.org/1999/xhtml");
```

Normally this is done by the `DOMParser`.

<!-- For more information, see About private data. -->

### Extension

Only [whatwg/dom](https://dom.spec.whatwg.org/) is implemented. If you want to
use features extended by other specifications, import them.

[whatwg/html](https://html.spec.whatwg.org/multipage/):

```ts
"https://deno.land/x/html_std/extends/all.ts";
import { HTMLElement } from "https://deno.land/x/html_std/mod.ts";
import { $, Document } from "https://deno.land/x/dom_std/mod.ts";
import { assert } from "https://deno.land/std/assert/assert_equals.ts";

const document = new Document();
$(document).type = "html";
const div = document.createElement("div");

assert(div instanceof HTMLElement);
```

## License

[MIT](LICENSE) © 2023 Tomoki Miyauchi
