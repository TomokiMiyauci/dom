import { Constructor, prop } from "./deps.ts";

interface IndexHandlers<This, T> {
  has?: (this: This, index: number) => boolean;
  get?: (this: This, index: number) => T;
}

/** Class decorator factory for index reference. */
// deno-lint-ignore ban-types
export function Indexer<U extends {}, R = unknown>(
  handlers: IndexHandlers<U, R>,
) {
  function creteIndexer<T extends Constructor<U>>(Ctor: T) {
    // @ts-ignore Mixin satisfies U
    abstract class Mixin extends Ctor {
      [k: number]: R;
      // deno-lint-ignore no-explicit-any
      constructor(...args: any) {
        super(...args);

        return new Proxy(this, {
          get: (target, prop, receiver) => {
            if (Reflect.has(target, prop)) {
              return Reflect.get(target, prop, receiver);
            }

            if (typeof prop !== "string" || !handlers.get) return;

            const index = Number.parseInt(prop);

            if (!Number.isInteger(index)) return;

            return handlers.get.call(target as never as U, index);
          },

          getOwnPropertyDescriptor: (target, prop) => {
            const desc = Reflect.getOwnPropertyDescriptor(target, prop);

            if (desc) return desc;

            if (typeof prop !== "string" || !handlers.has) return;

            const index = Number.parseInt(prop);

            if (
              !Number.isInteger(index) ||
              !handlers.has.call(target as never as U, index)
            ) return;

            return { configurable: true };
          },

          has: (target, prop) => {
            if (Reflect.has(target, prop)) return true;
            if (typeof prop !== "string" || !handlers.has) return false;

            const index = Number.parseInt(prop);

            if (!Number.isInteger(index)) return false;

            return handlers.has.call(target as never as U, index) ?? false;
          },
        });
      }
    }

    return Mixin;
  }

  return creteIndexer;
}

export class UnImplemented extends Error {}

export function debug(node: Node, depth = 0): string[] {
  const inputs: string[] = [node.nodeName];

  for (const child of node.childNodes) {
    inputs.push(...debug(child, depth + 1));
  }

  return inputs;
}

export class Get {
  static data = prop("data");
}

export function includes(
  derived: Function,
  constructor: Function,
  options: { excludes?: string[] } = {},
): void {
  const { excludes = ["constructor"] } = options;
  const descriptors = Object.getOwnPropertyDescriptors(constructor.prototype);

  excludes.forEach((key) => {
    delete descriptors[key];
  });

  Object.defineProperties(derived.prototype, descriptors);
}

export function extend(
  left: object,
  right: object,
  options: { prototype?: boolean; excludes?: PropertyKey[] } = {},
): object {
  const { prototype = false, excludes = ["constructor"] } = options;
  const desc = Object.getOwnPropertyDescriptors(right);
  const properties: Record<PropertyKey, PropertyDescriptor> = prototype
    ? (() => {
      const proto = Object.getPrototypeOf(right);
      const protoDesc = Object.getOwnPropertyDescriptors(proto);
      return {
        ...desc,
        ...protoDesc,
      };
    })()
    : desc;

  for (const key of excludes) {
    delete properties[key];
  }

  return Object.defineProperties(left, properties);
}
