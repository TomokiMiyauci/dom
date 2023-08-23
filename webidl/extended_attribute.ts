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
