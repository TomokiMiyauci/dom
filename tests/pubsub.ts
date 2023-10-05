export type Message = Succeed | Fail;

export interface Succeed {
  success: true;
}

export interface Fail<T = unknown> {
  success: false;
  error: T;
}

const { EventTarget, CustomEvent } = window;

export class PubSub<T> {
  #target = new EventTarget();
  #done = false;
  #key = "";
  #queue: T[] = [];

  publish(data: T) {
    this.#queue.push(data);
    this.#target.dispatchEvent(
      new CustomEvent(this.#key, { detail: { success: true } }),
    );
  }

  async *[Symbol.asyncIterator]() {
    while (!this.#done || this.#queue.length) {
      for (const item of this.#queue) yield item;

      this.#queue.length = 0;
      if (this.#done) break;

      await new Promise<void>((resolve, reject) => {
        this.#target.addEventListener(this.#key, (e) => {
          const message = (e as CustomEvent<Message>).detail;
          if (message.success) resolve();
          else reject(message.error);
        }, { once: true });
      });
    }
  }

  error(err: unknown): void {
    this.#terminate({ success: false, error: err });
  }

  unsubscribe(): void {
    this.#terminate({ success: true });
  }

  #terminate(message: Message) {
    this.#done = true;
    const event = new CustomEvent<Message>(this.#key, {
      detail: message,
    });
    this.#target.dispatchEvent(event);
  }
}
