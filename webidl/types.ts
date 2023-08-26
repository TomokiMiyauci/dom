import "npm:reflect-metadata";

export class MetaKey {
  static readonly Convertor = Symbol();
}

export function DOMString(
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
    parameters.concat({ index: parameterIndex, convert: String }),
    target,
    propertyKey,
  );
}

export interface Convertor {
  index: number;

  convert(input: unknown): unknown;
}

export function convert(
  target: object,
  prop: string | symbol,
  // deno-lint-ignore ban-types
  descriptor: { value?: Function },
): void {
  const convertors: Convertor[] = Reflect.getOwnMetadata(
    MetaKey.Convertor,
    target,
    prop,
  ) ?? [];

  const method = descriptor.value;

  if (!method) return;

  const length = method.length;

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

  const proxy = new Proxy(method, {
    apply: (target, thisArg, argArray) => {
      const converted = convertors.reduce(reducer, argArray);

      return Reflect.apply(target, thisArg, converted);
    },
  });

  descriptor.value = proxy;
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
