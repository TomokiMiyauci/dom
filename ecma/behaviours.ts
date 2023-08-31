import { IsExtensible, SameValue } from "../ecma/abstract_operations.ts";
import {
  IsAccessorDescriptor,
  IsDataDescriptor,
  IsGenericDescriptor,
} from "./data_types.ts";

/**
 * @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarydefineownproperty
 */
export function OrdinaryDefineOwnProperty(
  O: object,
  P: PropertyKey,
  Desc: PropertyDescriptor,
): boolean {
  // 1. Let current be ? O.[[GetOwnProperty]](P).
  const current = Reflect.getOwnPropertyDescriptor(O, P);

  // 2. Let extensible be ? IsExtensible(O).
  const extensible = IsExtensible(O);

  // 3. Return ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current).
  return ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current);
}

/**
 * @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-validateandapplypropertydescriptor
 */
export function ValidateAndApplyPropertyDescriptor(
  O: object | undefined,
  P: PropertyKey, // 1. Assert: IsPropertyKey(P) is true.
  extensible: boolean,
  Desc: PropertyDescriptor,
  current: PropertyDescriptor | undefined,
): boolean {
  // 2. If current is undefined, then
  if (!current) {
    // a. If extensible is false, return false.
    if (!extensible) return false;

    // b. If O is undefined, return true.
    if (!O) return true;

    // c. If IsAccessorDescriptor(Desc) is true, then
    if (IsAccessorDescriptor(Desc)) {
      // i. Create an own accessor property named P of object O whose [[Get]], [[Set]], [[Enumerable]], and [[Configurable]] attributes are set to the value of the corresponding field in Desc if Desc has that field, or to the attribute's default value otherwise.
      Object.defineProperty(O, P, {
        get: Desc.get,
        set: Desc.set,
        enumerable: Desc.enumerable,
        configurable: Desc.configurable,
      });

      // d. Else,
    } else {
      // i. Create an own data property named P of object O whose [[Value]], [[Writable]], [[Enumerable]], and [[Configurable]] attributes are set to the value of the corresponding field in Desc if Desc has that field, or to the attribute's default value otherwise.
      Object.defineProperty(O, P, {
        value: Desc.value,
        writable: Desc.writable,
        enumerable: Desc.enumerable,
        configurable: Desc.configurable,
      });
    }

    // e. Return true.
    return true;
  }

  // 4. If Desc does not have any fields, return true.
  if (!Object.keys(Desc).length) return true;

  // 5. If current.[[Configurable]] is false, then
  if (!current.configurable) {
    // a. If Desc has a [[Configurable]] field and Desc.[[Configurable]] is true, return false.
    if ("configurable" in Desc && Desc.configurable) return false;

    // b. If Desc has an [[Enumerable]] field and SameValue(Desc.[[Enumerable]], current.[[Enumerable]]) is false, return false.
    if (
      "enumerable" in Desc && !SameValue(Desc.enumerable, current.enumerable)
    ) return false;

    // c. If IsGenericDescriptor(Desc) is false and SameValue(IsAccessorDescriptor(Desc), IsAccessorDescriptor(current)) is false, return false.
    if (
      !IsGenericDescriptor(Desc) &&
      !SameValue(IsAccessorDescriptor(Desc), IsAccessorDescriptor(current))
    ) return false;

    // d. If IsAccessorDescriptor(current) is true, then
    if (IsAccessorDescriptor(current)) {
      // i. If Desc has a [[Get]] field and SameValue(Desc.[[Get]], current.[[Get]]) is false, return false.
      if ("get" in Desc && !SameValue(Desc.get, current.get)) return false;

      // ii. If Desc has a [[Set]] field and SameValue(Desc.[[Set]], current.[[Set]]) is false, return false.
      if ("set" in Desc && !SameValue(Desc.set, current.set)) return false;
    } else if (!current.writable) { // e. Else if current.[[Writable]] is false, then
      // i. If Desc has a [[Writable]] field and Desc.[[Writable]] is true, return false.
      if ("writable" in Desc && Desc.writable) return false;

      // ii. If Desc has a [[Value]] field and SameValue(Desc.[[Value]], current.[[Value]]) is false, return false.
      if ("value" in Desc && !SameValue(Desc.value, current.value)) {
        return false;
      }
    }
  }

  // 6. If O is not undefined, then
  if (O) {
    // a. If IsDataDescriptor(current) is true and IsAccessorDescriptor(Desc) is true, then
    if (IsDataDescriptor(current) && IsAccessorDescriptor(Desc)) {
      // i. If Desc has a [[Configurable]] field, let configurable be Desc.[[Configurable]]; else let configurable be current.[[Configurable]].
      const configurable = "configurable" in Desc
        ? Desc.configurable
        : current.configurable;
      // ii. If Desc has a [[Enumerable]] field, let enumerable be Desc.[[Enumerable]]; else let enumerable be current.[[Enumerable]].
      const enumerable = "enumerable" in Desc
        ? Desc.enumerable
        : current.enumerable;

      // iii. Replace the property named P of object O with an accessor property whose [[Configurable]] and [[Enumerable]] attributes are set to configurable and enumerable, respectively, and whose [[Get]] and [[Set]] attributes are set to the value of the corresponding field in Desc if Desc has that field, or to the attribute's default value otherwise.
      Object.defineProperty(O, P, {
        configurable,
        enumerable,
        value: Desc.value,
        writable: Desc.writable,
      });
    } else if (IsAccessorDescriptor(current) && IsDataDescriptor(Desc)) { // b. Else if IsAccessorDescriptor(current) is true and IsDataDescriptor(Desc) is true, then
      // i. If Desc has a [[Configurable]] field, let configurable be Desc.[[Configurable]]; else let configurable be current.[[Configurable]].
      const configurable = "configurable" in Desc
        ? Desc.configurable
        : current.configurable;

      // ii. If Desc has a [[Enumerable]] field, let enumerable be Desc.[[Enumerable]]; else let enumerable be current.[[Enumerable]].
      const enumerable = "enumerable" in Desc
        ? Desc.enumerable
        : current.enumerable;

      // iii. Replace the property named P of object O with a data property whose [[Configurable]] and [[Enumerable]] attributes are set to configurable and enumerable, respectively, and whose [[Value]] and [[Writable]] attributes are set to the value of the corresponding field in Desc if Desc has that field, or to the attribute's default value otherwise.
      Object.defineProperty(O, P, {
        configurable,
        enumerable,
        value: Desc.value,
        writable: Desc.writable,
      });
    } else { // c. Else,
      // i. For each field of Desc, set the corresponding attribute of the property named P of object O to the value of the field.
      Object.defineProperty(O, P, Desc);
    }
  }

  return true;
}
