export const map = new Map<object, Metadata>();

export type Global = "Window";

interface Metadata {
  scope: Global;
  name: string;
}

export function Exposed(
  global: Global | "*",
  name: string,
): (target: object) => void {
  return (target): void => {
    if (global === "*") global = "Window";

    map.set(target, { scope: global, name });
  };
}

/**
 * @throws {Error} If the {@linkcode descriptor}'s get is not defined.
 */
export function SameObject(
  _: unknown,
  ___: unknown,
  descriptor: PropertyDescriptor,
): void {
  if (!descriptor.get) throw new Error("it should be getter");

  const cache = new WeakMap();
  const cachedGetter = new Proxy(descriptor.get, {
    apply: (target, thisArg) => {
      if (cache.has(thisArg)) return cache.get(thisArg);

      const value = target.call(thisArg);
      cache.set(thisArg, value);

      return value;
    },
  });

  descriptor.get = cachedGetter;
}

/**
 * @see https://webidl.spec.whatwg.org/#PutForwards
 */
export function PutForwards<T extends object>(identifier: keyof T) {
  return (
    _: unknown,
    prop: string,
    descriptor: { get?: () => T },
  ) => {
    const getter = descriptor.get;

    if (!getter) throw new Error("it should be getter");

    function setter(this: unknown, value: unknown): void {
      const q = getter!.call(this);

      Reflect.set(q, identifier, value);
    }
    const name = `set ${prop}`;

    Object.defineProperty(setter, "name", { value: name });
    Object.defineProperty(descriptor, "set", { value: setter });
  };
}
