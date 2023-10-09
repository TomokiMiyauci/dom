import type { Node } from "../node.ts";
import type { IMutationObserver } from "../../../interface.d.ts";
import { Exposed } from "../../../webidl/extended_attribute.ts";
import { List } from "../../../infra/data_structures/list.ts";
import { Queue } from "../../../infra/data_structures/queue.ts";
import { iter } from "../../../deps.ts";
import { MutationRecord } from "./mutation_record.ts";
import { RegisteredObserver } from "./queue.ts";
import { $, internalSlots } from "../../../internal.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#interface-mutationobserver)
 */
@Exposed("Window", "MutationObserver")
export class MutationObserver implements IMutationObserver {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-mutationobserver-mutationobserver)
   */
  constructor(
    /**
     * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-mo-callback)
     */
    callback: MutationCallback,
  ) {
    // set this’s callback to callback.
    const internal = new MutationObserverInternals(callback);

    internalSlots.extends<MutationObserver>(this, internal);
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-mutationobserver-observe)
   */
  observe(target: Node, options: MutationObserverInit = {}): void {
    // 1. If either options["attributeOldValue"] or options["attributeFilter"] exists, and options["attributes"] does not exist, then set options["attributes"] to true.
    if (
      ("attributeOldValue" in options || "attributeFilter" in options) &&
      !("attributes" in options)
    ) options.attributes = true;

    // 2. If options["characterDataOldValue"] exists and options["characterData"] does not exist, then set options["characterData"] to true.
    if ("characterDataOldValue" in options && !("characterData" in options)) {
      options.characterData = true;
    }

    // 3. If none of options["childList"], options["attributes"], and options["characterData"] is true, then throw a TypeError.
    if (!options.childList && !options.attributes && !options.characterData) {
      throw new TypeError("<message>");
    }

    // 4. If options["attributeOldValue"] is true and options["attributes"] is false, then throw a TypeError.
    if (options.attributeOldValue && !options.attributes) {
      throw new TypeError("<message>");
    }

    // 5. If options["attributeFilter"] is present and options["attributes"] is false, then throw a TypeError.
    if (options.attributeFilter && !options.attributes) {
      throw new TypeError("<message>");
    }

    // 6. If options["characterDataOldValue"] is true and options["characterData"] is false, then throw a TypeError.
    if (options.characterDataOldValue && !options.characterData) {
      throw new TypeError("<message>");
    }

    const { registeredObserverList } = $(target);
    // 7. For each registered of target’s registered observer list, if registered’s observer is this:
    for (
      const registered of iter(registeredObserverList).filter(
        this.#isRegisteredObserverThis.bind(this),
      )
    ) {
      // 1. For each node of this’s node list, remove all transient registered observers whose source is registered from node’s registered observer list.
      for (const node of [...this.#_.nodeList]) {
        const list = $(node).registeredObserverList;
        list.remove((observer) => {
          return "source" in observer && observer.source === registered;
        });

        // 2. Set registered’s options to options.
        registered.options = options;
      }
    }

    // 8. Otherwise:
    if (registeredObserverList.isEmpty) {
      // 1. Append a new registered observer whose observer is this and options is options to target’s registered observer list.
      registeredObserverList.append({ observer: this, options });

      // 2. Append a weak reference to target to this’s node list.
      this.#_.nodeList.append(target);
    }
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-mutationobserver-disconnect)
   */
  disconnect(): void {
    // 1. For each node of this’s node list, remove any registered observer from node’s registered observer list for which this is the observer.
    for (const node of this.#_.nodeList) {
      $(node).registeredObserverList.remove(
        this.#isRegisteredObserverThis.bind(this),
      );
    }

    // 2. Empty this’s record queue.
    this.#_.recordQueue.empty();
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-mutationobserver-takerecords)
   */
  takeRecords(): MutationRecord[] {
    // 1. Let records be a clone of this’s record queue.
    const records = this.#_.recordQueue.clone();

    // 2. Empty this’s record queue.
    this.#_.recordQueue.empty();

    // 3. Return records.
    return [...records];
  }

  #isRegisteredObserverThis({ observer }: RegisteredObserver): boolean {
    return observer === this;
  }

  get #_() {
    return $<MutationObserver>(this);
  }
}

export class MutationObserverInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#mutationobserver-node-list)
   */
  nodeList: List<Node> = new List();

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-mo-queue)
   */
  recordQueue: Queue<MutationRecord> = new Queue();

  constructor(
    /**
     * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-mo-callback)
     */
    public callback: MutationCallback,
  ) {
  }
}
