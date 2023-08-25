import { Constructor, isNegativeZero } from "../deps.ts";
import {
  CanonicalNumericIndexString,
  OrdinaryGetOwnProperty,
  ToUnit32,
} from "../ecma/abstract_operations.ts";

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

/**
 * @see https://webidl.spec.whatwg.org/#LegacyUnenumerableNamedProperties
 */
export function LegacyUnenumerableNamedProperties<T extends Constructor>(
  Ctor: T,
) {
  abstract class LegacyUnenumerableNamedPropertiesMixin extends Ctor {
    [WebIDL.LegacyUnenumerableNamedProperties] = true;
  }

  return LegacyUnenumerableNamedPropertiesMixin;
}

export class WebIDL {
  static readonly isSupportedIndex = Symbol();
  static readonly getIndex = Symbol();
  static readonly isSupportedNamedProperty = Symbol();
  static readonly getNamedProperty = Symbol();
  static readonly namedPropertySetter = Symbol();
  static readonly LegacyUnenumerableNamedProperties = Symbol();
  static readonly LegacyOverrideBuiltIns = Symbol();
}

export interface IndexedProperties {
  [WebIDL.isSupportedIndex]: () => Iterable<number>;
  [WebIDL.getIndex]: (index: number) => unknown;
}

export interface NamedProperties {
  [WebIDL.isSupportedNamedProperty]: (index: string) => boolean;
  [WebIDL.getNamedProperty]: (index: string) => unknown;
  [WebIDL.namedPropertySetter]?: (index: string) => void;
}

/**
 * @see https://webidl.spec.whatwg.org/#LegacyPlatformObjectGetOwnProperty
 */
export function LegacyPlatformObjectGetOwnProperty(
  object:
    | (object | { [WebIDL.LegacyUnenumerableNamedProperties]: unknown })
    | (IndexedProperties | NamedProperties),
  prop: PropertyKey,
  ignoreNamedProps: boolean,
): PropertyDescriptor | undefined {
  if (WebIDL.isSupportedIndex in object && isArrayIndex(prop)) {
    const index = ToUnit32(prop);

    if (new Set(object[WebIDL.isSupportedIndex]()).has(index)) {
      const operation = object[WebIDL.getIndex];
      const value = operation.call(object, index);
      const desc: PropertyDescriptor = {
        configurable: true,
        enumerable: true,
        value,
      };

      return desc;
    }

    ignoreNamedProps = true;
  }

  if (
    WebIDL.isSupportedNamedProperty in object &&
    !ignoreNamedProps &&
    typeof prop === "string" &&
    runNamedPropertyVisibilityAlgorithm(prop, object)
  ) {
    // 1. Let operation be the operation used to declare the named property getter.
    const operation = object[WebIDL.getNamedProperty];

    // 2. Let value be an uninitialized variable.

    // 3. If operation was defined without an identifier, then set value to the result of performing the steps listed in the interface description to determine the value of a named property with P as the name.

    // 4. Otherwise, operation was defined with an identifier. Set value to the result of performing the method steps of operation with O as this and « P » as the argument values.
    const value = operation.call(object, prop);

    // 5. Let desc be a newly created Property Descriptor with no fields.
    // 6. Set desc.[[Value]] to the result of converting value to an ECMAScript value.
    const desc: PropertyDescriptor = { value };

    // 7. If O implements an interface with a named property setter, then set desc.[[Writable]] to true, otherwise set it to false.
    const writable = WebIDL.namedPropertySetter in object;
    desc.writable = writable;

    // 8. If O implements an interface with the [LegacyUnenumerableNamedProperties] extended attribute, then set desc.[[Enumerable]] to false, otherwise set it to true.
    const enumerable = !(WebIDL.LegacyUnenumerableNamedProperties in object);
    desc.enumerable = enumerable;

    // 9. Set desc.[[Configurable]] to true.
    desc.configurable = true;

    // 10. Return desc.
    return desc;
  }

  return OrdinaryGetOwnProperty(object, prop);
}

/**
 * @see https://webidl.spec.whatwg.org/#is-an-array-index
 */
export function isArrayIndex(prop: PropertyKey): prop is string {
  if (typeof prop !== "string") return false;

  const index = CanonicalNumericIndexString(prop);

  if (index === undefined) return false;

  if (!Number.isInteger(index)) return false;

  if (isNegativeZero(index) || index < 0 || index >= 2 ** 32 - 1) return false;

  return true;
}

export function runNamedPropertyVisibilityAlgorithm(
  prop: string,
  object: NamedProperties,
): boolean {
  // if (!object[WebIDL.isSupportedNamedProperty](prop)) return false;
  if (Object.hasOwn(object, prop)) return false;

  if (WebIDL.LegacyOverrideBuiltIns in object) return true;

  let prototype = Object.getPrototypeOf(object);

  while (prototype !== null) {
    if (Object.hasOwn(prototype, prop)) return false;

    prototype = Object.getPrototypeOf(prototype);
  }

  return true;
}
