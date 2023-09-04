import type { Node } from "./node.ts";
import type { Child } from "./types.ts";
import { OrderedSet } from "../../infra/data_structures/set.ts";
import type { IMutationObserver, IMutationRecord } from "../../interface.d.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";
import { List } from "../../infra/data_structures/list.ts";
import { Queue } from "../../infra/data_structures/queue.ts";
import { StaticNodeList } from "./node_list.ts";
import { getInclusiveAncestors } from "../trees/tree.ts";

export interface RegisteredObserver {
  observer: MutationObserver;
  options: MutationObserverInit;
}

export interface TransientRegisteredObserver extends RegisteredObserver {
  source: RegisteredObserver;
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#similar-origin-window-agent
 */
const surroundingAgent = {
  mutationObserverMicrotaskQueued: false,
  pendingMutationObservers: new OrderedSet<MutationObserver>(),
  signalSlots: new OrderedSet<unknown>(),
};

/**
 * @see https://dom.spec.whatwg.org/#queue-a-mutation-observer-compound-microtask
 */
export function queueMutationObserverMicrotask(): void {
  // 1. If the surrounding agent’s mutation observer microtask queued is true, then return.
  if (surroundingAgent.mutationObserverMicrotaskQueued) return;

  // 2. Set the surrounding agent’s mutation observer microtask queued to true.
  surroundingAgent.mutationObserverMicrotaskQueued = true;

  // 3. Queue a microtask to notify mutation observers.
  queueMicrotask(notifyMutationObservers);
}

/**
 * @see https://dom.spec.whatwg.org/#notify-mutation-observers
 */
export function notifyMutationObservers(): void {
  // 1. Set the surrounding agent’s mutation observer microtask queued to false.
  surroundingAgent.mutationObserverMicrotaskQueued = false;

  // 2. Let notifySet be a clone of the surrounding agent’s pending mutation observers.
  const notifySet = surroundingAgent.pendingMutationObservers.clone();

  // 3. Empty the surrounding agent’s pending mutation observers.
  surroundingAgent.pendingMutationObservers.empty();

  // 4. Let signalSet be a clone of the surrounding agent’s signal slots.
  const signalSet = surroundingAgent.signalSlots.clone();

  // 5. Empty the surrounding agent’s signal slots.
  surroundingAgent.signalSlots.empty();

  // 6. For each mo of notifySet:
  for (const mo of [...notifySet]) {
    const recordQueue = mo["recordQueue"];

    // 1. Let records be a clone of mo’s record queue.
    const records = recordQueue.clone();

    // 2. Empty mo’s record queue.
    recordQueue.empty();

    // 3. For each node of mo’s node list, remove all transient registered observers whose observer is mo from node’s registered observer list.
    for (const node of [...mo["nodeList"]]) {
      node["registeredObserverList"].remove((registered) => {
        return "source" in registered && registered.observer === mo;
      });
    }

    // 4. If records is not empty, then invoke mo’s callback with « records, mo », and mo. If this throws an exception, catch it, and report the exception.
    if (!records.isEmpty) {
      mo["callback"].apply(mo, [Array.from(records), mo]);
    }
  }

  // 7. For each slot of signalSet, fire an event named slotchange, with its bubbles attribute set to true, at slot.
  // TODO
}

/**
 * @see https://dom.spec.whatwg.org/#interface-mutationobserver
 */
Exposed(Window);
export class MutationObserver implements IMutationObserver {
  private callback: MutationCallback;
  private nodeList: List<Node> = new List();
  private recordQueue: Queue<MutationRecord> = new Queue();

  constructor(callback: MutationCallback) {
    this.callback = callback;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-mutationobserver-observe
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

    // 7. For each registered of target’s registered observer list, if registered’s observer is this:
    for (const registered of target["registeredObserverList"]) {
      // 1. For each node of this’s node list, remove all transient registered observers whose source is registered from node’s registered observer list.
      if (registered.observer === this) {
        for (const node of [...this.nodeList]) {
          const list = node["registeredObserverList"];
          list.remove((observer) => {
            return "source" in observer && observer.source === registered;
          });

          // 2. Set registered’s options to options.
          registered.options = options;
        }
      }
    }

    // 8. Otherwise:
    if (target["registeredObserverList"].isEmpty) {
      // 1. Append a new registered observer whose observer is this and options is options to target’s registered observer list.
      target["registeredObserverList"].append({ observer: this, options });

      // 2. Append a weak reference to target to this’s node list.
      this.nodeList.append(target);
    }
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-mutationobserver-disconnect
   */
  disconnect(): void {
    // 1. For each node of this’s node list, remove any registered observer from node’s registered observer list for which this is the observer.
    for (const node of this.nodeList) {
      node["registeredObserverList"].remove(({ observer }) =>
        observer === this
      );
    }

    // 2. Empty this’s record queue.
    this.recordQueue.empty();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-mutationobserver-takerecords
   */
  takeRecords(): MutationRecord[] {
    // 1. Let records be a clone of this’s record queue.
    const records = this.recordQueue.clone();

    // 2. Empty this’s record queue.
    this.recordQueue.empty();

    // 3. Return records.
    return Array.from(records);
  }
}

/**
 * @see https://dom.spec.whatwg.org/#queueing-a-mutation-record
 */
export function queueMutationRecord(
  type: MutationRecordType,
  target: Node,
  name: string | null,
  namespace: string | null,
  oldValue: string | null,
  addedNodes: OrderedSet<Node>,
  removedNodes: OrderedSet<Node>,
  previousSibling: Node | null,
  nextSibling: Node | null,
): void {
  // 1. Let interestedObservers be an empty map.
  const interestedObservers = new Map<MutationObserver, string | null>();

  // 2. Let nodes be the inclusive ancestors of target.
  const nodes = getInclusiveAncestors(target) as Iterable<Node>;

  // 3. For each node in nodes, and then for each registered of node’s registered observer list:
  for (const node of nodes) {
    for (const registered of node["registeredObserverList"]) {
      // 1. Let options be registered’s options.
      const options = registered.options;

      // 2. If none of the following are true
      // - node is not target and options["subtree"] is false
      if (node !== target && !options.subtree) continue;

      // - type is "attributes" and options["attributes"] either does not exist or is false
      if (type === "attributes" && !options.attributes) continue;

      // - type is "attributes", options["attributeFilter"] exists, and options["attributeFilter"] does not contain name or namespace is non-null
      if (
        type === "attributes" &&
        "attributeFilter" in options &&
        (typeof name === "string" && !options.attributeFilter?.includes(name) ||
          namespace !== null)
      ) continue;

      // - type is "characterData" and options["characterData"] either does not exist or is false
      if (type === "characterData" && !options.characterData) continue;

      // - type is "childList" and options["childList"] is false
      if (type === "childList" && !options.childList) continue;

      // then:
      // 1. Let mo be registered’s observer.
      const mo = registered.observer;

      // 2. If interestedObservers[mo] does not exist, then set interestedObservers[mo] to null.
      if (!interestedObservers.has(mo)) interestedObservers.set(mo, null);

      // 3. If either type is "attributes" and options["attributeOldValue"] is true, or type is "characterData" and options["characterDataOldValue"] is true, then set interestedObservers[mo] to oldValue.
      if (
        (type === "attributes" && options.attributeOldValue) ||
        (type === "characterData" && options.characterDataOldValue)
      ) interestedObservers.set(mo, oldValue);
    }
  }

  // 4. For each observer → mappedOldValue of interestedObservers:
  for (const [observer, mappedOldValue] of interestedObservers) {
    // 1. Let record be a new MutationRecord object with its type set to type, target set to target, attributeName set to name, attributeNamespace set to namespace, oldValue set to mappedOldValue, addedNodes set to addedNodes, removedNodes set to removedNodes, previousSibling set to previousSibling, and nextSibling set to nextSibling.
    const record = new MutationRecord(
      type,
      target,
      name,
      namespace,
      mappedOldValue,
      new StaticNodeList(addedNodes),
      new StaticNodeList(removedNodes),
      previousSibling,
      nextSibling,
    );

    // 2. Enqueue record to observer’s record queue.
    observer["recordQueue"].enqueue(record);

    // 3. Append observer to the surrounding agent’s pending mutation observers.
    surroundingAgent.pendingMutationObservers.append(observer);
  }

  // 5. Queue a mutation observer microtask.
  queueMutationObserverMicrotask();
}

/**
 * @see https://dom.spec.whatwg.org/#queue-a-tree-mutation-record
 */
export function queueTreeMutationRecord(
  target: Node,
  addedNodes: OrderedSet<Node>,
  removedNodes: OrderedSet<Node>,
  previousSibling: Child,
  nextSibling: Child,
): void {
  // 1. Assert: either addedNodes or removedNodes is not empty.

  // 2. Queue a mutation record of "childList" for target with null, null, null, addedNodes, removedNodes, previousSibling, and nextSibling.
  queueMutationRecord(
    "childList",
    target,
    null,
    null,
    null,
    addedNodes,
    removedNodes,
    previousSibling,
    nextSibling,
  );
}

@Exposed(Window)
export class MutationRecord implements IMutationRecord {
  constructor(
    readonly type: MutationRecordType,
    readonly target: Node,
    readonly attributeName: string | null,
    readonly attributeNamespace: string | null,
    readonly oldValue: string | null,
    readonly addedNodes: NodeList,
    readonly removedNodes: NodeList,
    readonly previousSibling: Node | null,
    readonly nextSibling: Node | null,
  ) {}
}
