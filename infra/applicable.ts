export interface Callback<Args extends readonly unknown[]> {
  (...args: Args): void;
}

export class Steps<Args extends readonly unknown[]> {
  // deno-lint-ignore no-explicit-any
  readonly #set: Set<Callback<any>> = new Set();

  /** Register step. */
  define(fn: Callback<Args>): void {
    this.#set.add(fn);
  }

  /** Execute all registered steps. */
  run(...args: Args): void {
    for (const fn of this.#set) fn(...args);
  }
}
