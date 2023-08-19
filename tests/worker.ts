import type { Message, Test, TestReport } from "./types.ts";
import * as modules from "../mod.ts";
import { initLast } from "https://deno.land/x/seqtools@1.0.0/init_last.ts";

const parser = new modules.DOMParser();

for (const item of Object.keys(modules)) {
  Object.defineProperty(self, item, { value: modules[item] });
}

addEventListener("message", (event: MessageEvent<Message>) => {
  const { source, scripts, title } = event.data;

  self.window = self;
  self.parent = self;

  const document = parser.parseFromString(source, "text/html")!;
  self.window.document = document;

  const ids = document.querySelectorAll("[id]");

  [...ids].forEach((element) => {
    const id = element.getAttribute("id");

    self[id] = element;
  });

  const [deps, testScript] = initLast(scripts);
  const tests: Test[] = [];

  eval(
    deps.concat(
      `add_result_callback((test) => {tests.push(test)});`,
    ).concat(testScript!).join("\n"),
  );

  const testResults: TestReport[] = tests.map((
    { name, status, message, stack },
  ) => ({
    title,
    description: name,
    isSuccess: !status,
    message,
    stack,
  }));

  postMessage(testResults);
});
