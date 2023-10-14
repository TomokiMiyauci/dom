import { prop } from "./deps.ts";
import { data } from "./symbol.ts";

export class Get {
  static data = prop(data);
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
