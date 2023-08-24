import { type Constructor } from "../deps.ts";

/**
 * @see https://webidl.spec.whatwg.org/#idl-named-properties
 */
export function NamedProperties<T extends object>(
  { getSupportedPropertyNames, getter }: {
    getSupportedPropertyNames: (this: T) => Iterable<string>;
    getter: (this: T, prop: string) => unknown;
  },
) {
  return <U extends Constructor<T>>(Ctor: U) => {
    // @ts-ignore It ensure types
    abstract class NamedPropertiesMixin extends Ctor {
      constructor(...args: any) {
        super(...args);

        return new Proxy(this as any as T, {
          get: (target, prop, receiver) => {
            if (typeof prop === "symbol" || Reflect.has(target, prop)) {
              return Reflect.get(target, prop, receiver);
            }

            const set = new Set(getSupportedPropertyNames.call(target));

            if (set.has(prop)) return getter.call(target, prop);

            return Reflect.get(target, prop, receiver);
          },
        });
      }
    }

    return NamedPropertiesMixin;
  };
}
