/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32
 */
export function ToUnit32(argument: unknown): number {
  // 1. Let number be ? ToNumber(argument).
  const number = Number(argument);

  // 2. If number is not finite or number is either +0𝔽 or -0𝔽, return +0𝔽.
  if (!Number.isFinite(number) || !number) return +0;

  // 3. Let int be truncate(ℝ(number)).
  const int = Math.trunc(number);

  // 4. Let int32bit be int modulo 232.
  const int32bit = int % (2 ** 32);

  // 5. Return 𝔽(int32bit).
  return Number(int32bit);
}

/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-canonicalnumericindexstring
 */
export function CanonicalNumericIndexString(
  argument: string,
): number | undefined {
  // 1. If argument is "-0", return -0𝔽.
  if (argument === "-0") return -0;

  // 2. Let n be ! ToNumber(argument).
  const n = Number(argument);

  // 3. If ! ToString(n) is argument, return n.
  if (String(n) === argument) return n;

  // 4. Return undefined.
  return undefined;
}

/**
 * @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarygetownproperty
 */
export function OrdinaryGetOwnProperty(
  object: object,
  prop: PropertyKey,
): PropertyDescriptor | undefined {
  const maybeDesc = Object.getOwnPropertyDescriptor(object, prop) ??
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(object), prop);
  if (!maybeDesc) return undefined;

  const desc: PropertyDescriptor = {};

  if ("value" in maybeDesc) {
    desc.value = maybeDesc.value;
    desc.writable = maybeDesc.writable;
  } else {
    desc.get = maybeDesc.get;
    desc.set = maybeDesc.set;
  }

  desc.enumerable = maybeDesc.enumerable;
  desc.configurable = maybeDesc.configurable;

  return desc;
}

/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createmethodproperty
 */
export function CreateMethodProperty(
  O: object,
  P: PropertyKey,
  V: unknown,
): void {
  // 1. Assert: O is an ordinary, extensible object with no non-configurable properties.
  // 2. Let newDesc be the PropertyDescriptor { [[Value]]: V, [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: true }.
  const newDesc: PropertyDescriptor = {
    value: V,
    writable: true,
    enumerable: false,
    configurable: true,
  };
  // 3. Perform ! DefinePropertyOrThrow(O, P, newDesc).
  Object.defineProperty(O, P, newDesc);
  // 4. Return unused.
}

/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isextensible-o
 */
export function IsExtensible(O: object): boolean {
  // 1. Return ? O.[[IsExtensible]]().
  return Reflect.isExtensible(O);
}

/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue
 */
export function SameValue(x: unknown, y: unknown): boolean {
  // TODO
  return Object.is(x, y);
}
