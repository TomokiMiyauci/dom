import { Body } from "./infrastructure.ts";

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#bodyinit-safely-extract)
 */
export function extractSafely(
  object: Uint8Array | BodyInit,
): [body: Body, type: Uint8Array | null] {
  // 1. If object is a ReadableStream object, then:
  // 1. Assert: object is neither disturbed nor locked.

  // 2. Return the result of extracting object.
  return extract(object);
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-bodyinit-extract)
 */
export function extract(
  object: Uint8Array | BodyInit,
  keepalive = false,
): [body: Body, type: Uint8Array | null] {
  // 1. Let stream be null.
  let stream: ReadableStream = null!;

  // 2. If object is a ReadableStream object, then set stream to object.
  if (object instanceof ReadableStream) stream = object;
  // 3. Otherwise, if object is a Blob object, set stream to the result of running object’s get stream.
  else if (object instanceof Blob) {}

  // 4. Otherwise, set stream to a new ReadableStream object, and set up stream with byte reading support.

  // 5. Assert: stream is a ReadableStream object.

  // 6. Let action be null.

  // 7. Let source be null.
  let source = null;

  // 8. Let length be null.

  // 9. Let type be null.
  let type: null = null;

  // 10. Switch on object:

  // 11. If source is a byte sequence, then set action to a step that returns source and length to source’s length.

  // 12. If action is non-null, then run these steps in parallel:

  // 1. Run action.

  // Whenever one or more bytes are available and stream is not errored, enqueue a Uint8Array wrapping an ArrayBuffer containing the available bytes into stream.

  // When running action is done, close stream.

  // 13. Let body be a body whose stream is stream, source is source, and length is length.
  const body: Body = {
    source,
    stream,
    length,
  };

  // 14. Return (body, type).
  return [body, type];
}
