export class WebIDL {
  static readonly supportedIndexes = Symbol();
  static readonly supportedNamedProperties = Symbol();
  static readonly namedPropertyGetter = Symbol();
  static readonly namedPropertySetter = Symbol();
  static readonly namedPropertyDeleter = Symbol();
  static readonly indexGetter = Symbol();
  static readonly indexSetter = Symbol();
  static readonly LegacyUnenumerableNamedProperties = Symbol();
  static readonly LegacyOverrideBuiltIns = Symbol();
}

export function getter(type: "index" | "name") {
  return (
    object: object,
    _: unknown,
    descriptor: PropertyDescriptor,
  ): void => {
    const key = type === "index"
      ? WebIDL.indexGetter
      : WebIDL.namedPropertyGetter;

    Object.defineProperty(object.constructor.prototype, key, descriptor);
  };
}

/**
 * @throws {TypeError}
 */
export function stringifier(
  object: object,
  _: unknown,
  descriptor: PropertyDescriptor,
) {
  const getter = descriptor.get;

  if (!getter) throw new TypeError("stringifier must use with getter");

  Object.defineProperty(object, "toString", {
    enumerable: true,
    writable: true,
    configurable: true,
    value: getter,
  });
}

export type Getter<
  T extends "index" | "name",
> = T extends ["name"] ? { [WebIDL.namedPropertyGetter](name: string): unknown }
  : { [WebIDL.indexGetter](index: number): unknown };

export type PrimitiveType = boolean | number;

/**
 * @see https://webidl.spec.whatwg.org/#idl-constants
 */
export function constant<T extends string>(
  target: { prototype: object } & { [k in T]: PrimitiveType },
  prop: T,
): void {
  const value = target[prop];

  Object.defineProperty(target.prototype, prop, { value });
}

export type Const<I extends string, T extends PrimitiveType> = {
  readonly [k in I]: T;
};
