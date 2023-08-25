// deno-lint-ignore-file no-explicit-any
import {
  LegacyPlatformObjectGetOwnProperty,
  runNamedPropertyVisibilityAlgorithm,
} from "./legacy_extended_attributes.ts";
import { WebIDL } from "./legacy_extended_attributes.ts";

export function getter(type: "index" | "name") {
  return (
    object: object,
    _: unknown,
    descriptor: PropertyDescriptor,
  ): void => {
    const key = type === "index" ? WebIDL.getIndex : WebIDL.getNamedProperty;
    Object.defineProperty(object.constructor.prototype, key, descriptor);
  };
}

export type Getter<
  T extends ["index", "name"] | ["name", "index"] | ["index"] | ["name"],
> = T extends ["name"] ? {
    [WebIDL.getNamedProperty](name: string): unknown;
  }
  : T extends ["index"] ? {
      [WebIDL.getIndex](index: number): unknown;
    }
  : {
    [WebIDL.getNamedProperty](name: string): unknown;
    [WebIDL.getIndex](index: number): unknown;
  };

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

        if (isSupportIndexedProperty(target)) {
          for (const index of target[WebIDL.isSupportedIndex].call(target)) {
            set.add(String(index));
          }
        }

        if (isSupportNamedProperty(target)) {
          for (
            const name of target[WebIDL.isSupportedNamedProperty].call(target)
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
}

function isSupportIndexedProperty(object: object): object is IndexedProperty {
  return WebIDL.isSupportedIndex in object;
}

interface IndexedProperty {
  IndexPropertyGetter: () => any;
  PropertyIndex(): Iterable<number>;
}

interface NamedProperty {
  NamedPropertyGetter: () => any;
  PropertyName(): Iterable<string>;
}

function isSupportNamedProperty(object: object): object is NamedProperty {
  return WebIDL.isSupportedNamedProperty in object;
}
