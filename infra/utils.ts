export class Indexer<T> {
  constructor(get: (index: number) => T) {
    return new Proxy(this, {
      get: (target, prop) => {
        if (typeof prop === "string") {
          const indexLike = Number(prop);

          if (Number.isInteger(indexLike)) return get(indexLike);
        }

        return target[prop as never];
      },
    });
  }
}
