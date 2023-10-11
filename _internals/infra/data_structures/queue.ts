import { ListCore } from "./common.ts";

export class Queue<T> extends ListCore<T, Queue<T>> {
  protected override create(): Queue<T> {
    return new Queue();
  }

  /** O(1) */
  enqueue(item: T): void {
    this.append(item);
  }

  /** O(1) */
  dequeue(): T | null {
    if (this.isEmpty) return null;

    const first = this.list.pop()!;

    return first;
  }
}
