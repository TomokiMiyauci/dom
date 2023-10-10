# dom

DOM reference implementation.

This is an implementation that strictly adheres to the DOM specifications
([whatwg/dom](https://dom.spec.whatwg.org/) and
[wpt/dom](https://github.com/web-platform-tests/wpt/tree/master/dom)).

Current status: test pass 46946/?

## Usage

```ts
import { Document } from "https://deno.land/x/redom/mod.ts";

const document = new Document();
document.documentElement.childNodes[1].appendChild(
  document.createElement("div"),
);
const div = document.querySelector("div");
```
