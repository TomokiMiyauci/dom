export class PubSub<T> {
  #target = new EventTarget();
  #done = false;
  #key = "";
  #queue: T[] = [];

  publish(data: T) {
    this.#queue.push(data);
    this.#target.dispatchEvent(new Event(this.#key));
  }

  async *[Symbol.asyncIterator]() {
    while (!this.#done || this.#queue.length) {
      for (const item of this.#queue) yield item;

      this.#queue.length = 0;
      if (this.#done) break;

      await new Promise<void>((resolve) => {
        this.#target.addEventListener(this.#key, () => {
          resolve();
        }, { once: true });
      });
    }
  }

  unsubscribe() {
    this.#done = true;
    this.#target.dispatchEvent(new Event(this.#key));
  }
}
