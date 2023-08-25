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

export type Getter<
  T extends "index" | "name",
> = T extends ["name"] ? { [WebIDL.namedPropertyGetter](name: string): unknown }
  : { [WebIDL.indexGetter](index: number): unknown };
