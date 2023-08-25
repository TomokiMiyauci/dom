import { Constructor, isNegativeZero } from "../deps.ts";
import { WebIDL } from "./idl.ts";
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

export abstract class LegacyPlatformObject {
  constructor() {
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (Reflect.has(target, prop)) {
          return Reflect.get(target, prop, receiver);
        }

        const desc = LegacyPlatformObjectGetOwnProperty(target, prop, false);

        if (!desc) return;
        if (Object.hasOwn(desc, "value")) return desc.value;
        return desc.get?.call(target);
      },
      has: (target, prop) => {
        if (Reflect.has(target, prop)) return true;

        const desc = LegacyPlatformObjectGetOwnProperty(target, prop, false);

        return !!desc;
      },
      getOwnPropertyDescriptor: (target, prop) => {
        return LegacyPlatformObjectGetOwnProperty(target, prop, false);
      },
      preventExtensions: () => false,
      ownKeys: (target) => {
        const set = new Set<string | symbol>();
        const supportedIndexes = target[WebIDL.supportedIndexes];

        if (supportedIndexes) {
          for (const index of supportedIndexes.call(target)) {
            set.add(String(index));
          }
        }

        if (isNamedProperty(target)) {
          for (
            const name of target[WebIDL.supportedNamedProperties].call(target)
          ) {
            if (runNamedPropertyVisibilityAlgorithm(name, target)) {
              set.add(name);
            }
          }
        }

        Object.getOwnPropertyNames(target).forEach(set.add.bind(set));
        Object.getOwnPropertySymbols(target).forEach(set.add.bind(set));

        return Array.from(set);
      },
    });
  }

  abstract [WebIDL.supportedIndexes]?(): Set<number>;
  abstract [WebIDL.supportedNamedProperties]?(): Set<string>;
}

export interface IndexedProperties {
  [WebIDL.supportedIndexes]: () => Set<number>;
  [WebIDL.indexGetter]: (index: number) => unknown;
  [WebIDL.indexSetter]?: (index: number) => void;
}

export interface NamedProperties {
  [WebIDL.supportedNamedProperties]: () => Set<string>;
  [WebIDL.namedPropertyGetter]: (name: string) => unknown;
  [WebIDL.namedPropertySetter]?: (name: string) => void;
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
  if (isIndexedProperty(object) && isArrayIndex(prop)) {
    const index = ToUnit32(prop);

    if (object[WebIDL.supportedIndexes].call(object).has(index)) {
      const operation = object[WebIDL.indexGetter];
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
    isNamedProperty(object) &&
    !ignoreNamedProps &&
    typeof prop === "string" &&
    runNamedPropertyVisibilityAlgorithm(prop, object)
  ) {
    // 1. Let operation be the operation used to declare the named property getter.
    const operation = object[WebIDL.namedPropertyGetter];

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
  if (!object[WebIDL.supportedNamedProperties].call(object).has(prop)) {
    return false;
  }
  if (Object.hasOwn(object, prop)) return false;

  if (WebIDL.LegacyOverrideBuiltIns in object) return true;

  let prototype = Object.getPrototypeOf(object);

  while (prototype !== null) {
    if (Object.hasOwn(prototype, prop)) return false;

    prototype = Object.getPrototypeOf(prototype);
  }

  return true;
}

function isIndexedProperty(
  object: object,
): object is IndexedProperties {
  return WebIDL.supportedIndexes in object && !!object[WebIDL.supportedIndexes];
}
function isNamedProperty(object: object): object is NamedProperties {
  return WebIDL.supportedNamedProperties in object &&
    !!object[WebIDL.supportedNamedProperties];
}
