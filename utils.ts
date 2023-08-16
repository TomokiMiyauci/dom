import { Constructor } from "./deps.ts";

/** Class decorator factory for index reference. */
// deno-lint-ignore ban-types
export function Indexer<U extends {}, R = unknown>(
  get: (this: U, index: number) => R,
) {
  function creteIndexer<T extends Constructor<U>>(Ctor: T) {
    // @ts-ignore Mixin satisfies U
    abstract class Mixin extends Ctor {
      [k: number]: R;
      // deno-lint-ignore no-explicit-any
      constructor(...args: any) {
        super(...args);

        return new Proxy(this, {
          get: (target, prop) => {
            if (typeof prop === "string") {
              const indexLike = Number(prop);

              if (Number.isInteger(indexLike)) {
                return get.call(target as never as U, indexLike);
              }
            }

            return target[prop as never];
          },
        });
      }
    }

    return Mixin;
  }

  return creteIndexer;
}

export class UnImplemented extends Error {}
