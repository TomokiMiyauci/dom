export function LegacyNullToEmptyString(
  _: unknown,
  __: unknown,
  descriptor: PropertyDescriptor,
) {
  const { set } = descriptor;
  if (set) {
    descriptor.set = new Proxy(set, {
      apply: (target, thisArg, argArray) => {
        const [first, ...rest] = argArray;
        const firstArg = first === null ? "" : first;
        const newArgs = [firstArg].concat(rest);

        return Reflect.apply(target, thisArg, newArgs);
      },
    });
  }
}
