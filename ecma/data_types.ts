/**
 * @see https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isdatadescriptor
 */
export function IsDataDescriptor(
  desc: PropertyDescriptor | undefined,
): desc is DataDescriptor {
  // 1. If Desc is undefined, return false.
  if (!desc) return false;

  // 2. If Desc has a [[Value]] field, return true.
  // 3. If Desc has a [[Writable]] field, return true.
  if ("value" in desc || "writable" in desc) return true;

  // 4. Return false.
  return false;
}

export type DataDescriptor =
  & PropertyDescriptor
  & Required<
    (
      | Pick<PropertyDescriptor, "value">
      | Pick<PropertyDescriptor, "writable">
    )
  >;

/**
 * @see https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isaccessordescriptor
 */
export function IsAccessorDescriptor(
  Desc: PropertyDescriptor | undefined,
): Desc is AccessorDescriptor {
  // 1. If Desc is undefined, return false.
  if (!Desc) return false;

  // 2. If Desc has a [[Get]] field, return true.
  if ("get" in Desc) return true;

  // 3. If Desc has a [[Set]] field, return true.
  if ("set" in Desc) return true;

  // 4. Return false.
  return false;
}

export type AccessorDescriptor =
  & PropertyDescriptor
  & Required<
    (
      | Pick<PropertyDescriptor, "get">
      | Pick<PropertyDescriptor, "set">
    )
  >;

/**
 * @see https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isgenericdescriptor
 */
export function IsGenericDescriptor(
  Desc: PropertyDescriptor | undefined,
): Desc is GenericDescriptor {
  // 1. If Desc is undefined, return false.
  if (!Desc) return false;

  // 2. If IsAccessorDescriptor(Desc) is true, return false.
  // 3. If IsDataDescriptor(Desc) is true, return false.
  if (IsAccessorDescriptor(Desc) || IsDataDescriptor(Desc)) return false;

  // 4. Return true.
  return true;
}

export type GenericDescriptor = Pick<
  PropertyDescriptor,
  "configurable" | "enumerable"
>;
