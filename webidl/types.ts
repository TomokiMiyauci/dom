import "npm:reflect-metadata";
import { convertScalar } from "../infra/string.ts";

export class MetaKey {
  static readonly Convertor = Symbol();
}

export function DOMString(
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
): void {
  const parameters: Convertor[] = Reflect.getMetadata(
    MetaKey.Convertor,
    target,
    propertyKey,
  ) ?? [];

  Reflect.defineMetadata(
    MetaKey.Convertor,
    parameters.concat({ index: parameterIndex, convert: String }),
    target,
    propertyKey,
  );
}

DOMString.exclude = (
  predicate: (value: unknown) => boolean,
): (
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
) => void => {
  return (target, propertyKey, parameterIndex): void => {
    const parameters: Convertor[] = Reflect.getMetadata(
      MetaKey.Convertor,
      target,
      propertyKey,
    ) ?? [];
    const convert = (value: unknown): unknown => {
      return predicate(value) ? value : String(value);
    };

    Reflect.defineMetadata(
      MetaKey.Convertor,
      parameters.concat({ index: parameterIndex, convert }),
      target,
      propertyKey,
    );
  };
};

export interface Convertor {
  index: number;

  convert(input: unknown): unknown;
}

export function convert(
  target: object,
  prop: string | symbol,
  // deno-lint-ignore ban-types
  descriptor: { value?: Function } | { set?: Function },
): void {
  const convertors: Convertor[] = Reflect.getOwnMetadata(
    MetaKey.Convertor,
    target,
    prop,
  ) ?? [];

  const normalized = "value" in descriptor
    ? { type: "value", value: descriptor.value }
    : "set" in descriptor
    ? { type: "set", value: descriptor.set }
    : undefined;

  if (!normalized || !normalized.value) return;

  const length = normalized.value.length;

  function reducer(acc: unknown[], convertor: Convertor): unknown[] {
    // rest parameter
    if (length <= convertor.index) {
      const heads = acc.slice(0, convertor.index);
      const rests = acc.slice(convertor.index);
      const converted = rests.map(convertor.convert);

      return heads.concat(converted);
    }

    return applyConvert(acc, convertor);
  }

  const proxy = new Proxy(normalized.value, {
    apply: (target, thisArg, argArray) => {
      const converted = convertors.reduce(reducer, argArray);

      return Reflect.apply(target, thisArg, converted);
    },
  });

  Object.defineProperty(descriptor, normalized.type, { value: proxy });
}

function applyConvert(
  inputs: readonly unknown[],
  convertor: Convertor,
): unknown[] {
  const array = inputs.slice();
  const { index, convert } = convertor;

  if (index in array) {
    array[index] = convert(array[index]);
  }

  return array;
}

export function USVString(
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  const parameters: Convertor[] = Reflect.getMetadata(
    MetaKey.Convertor,
    target,
    propertyKey,
  ) ?? [];

  Reflect.defineMetadata(
    MetaKey.Convertor,
    parameters.concat({ index: parameterIndex, convert: convertScalar }),
    target,
    propertyKey,
  );
}
