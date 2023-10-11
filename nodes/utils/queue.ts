import { StaticNodeList } from "../node_list.ts";
import { MutationRecord } from "../mutation_record.ts";
import { OrderedSet } from "../../_internals/infra/data_structures/set.ts";
import { $, tree } from "../../internal.ts";
import { fireEvent } from "../../events/fire.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#registered-observer)
 */
export interface RegisteredObserver {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#registered-observer-observer)
   */
  observer: MutationObserver;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#registered-observer-options)
   */
  options: MutationObserverInit;
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#transient-registered-observer)
 */
export interface TransientRegisteredObserver extends RegisteredObserver {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#transient-registered-observer-source)
   */
  source: RegisteredObserver;
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#similar-origin-window-agent
 */
const surroundingAgent = {
  mutationObserverMicrotaskQueued: false,
  pendingMutationObservers: new OrderedSet<MutationObserver>(),
  signalSlots: new OrderedSet<EventTarget>(),
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
    // 1. Let records be a clone of mo’s record queue.
    const records = $(mo).recordQueue.clone();

    // 2. Empty mo’s record queue.
    $(mo).recordQueue.empty();

    // 3. For each node of mo’s node list, remove all transient registered observers whose observer is mo from node’s registered observer list.
    for (const node of [...$(mo).nodeList]) {
      $(node).registeredObserverList.remove((registered) => {
        return "source" in registered && registered.observer === mo;
      });
    }

    // 4. If records is not empty, then invoke mo’s callback with « records, mo », and mo. If this throws an exception, catch it, and report the exception.
    if (!records.isEmpty) {
      $(mo).callback.apply(mo, [Array.from(records), mo]);
    }
  }

  // 7. For each slot of signalSet, fire an event named slotchange, with its bubbles attribute set to true, at slot.
  for (const slot of signalSet) {
    fireEvent(
      "slotchange",
      slot,
      undefined,
      (event) => $(event).bubbles = true,
    );
  }
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#queue-a-tree-mutation-record)
 */
export function queueTreeMutationRecord(
  target: Node,
  addedNodes: OrderedSet<Node>,
  removedNodes: OrderedSet<Node>,
  previousSibling: Node | null,
  nextSibling: Node | null,
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

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#queueing-a-mutation-record)
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
  const nodes = tree.inclusiveAncestors(target);

  // 3. For each node in nodes, and then for each registered of node’s registered observer list:
  for (const node of nodes) {
    for (const registered of $(node).registeredObserverList) {
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
    // 1. Let record be a new MutationRecord object with its type set to type,
    const record = new MutationRecord(
      type,
      // target set to target,
      target,
      // attributeName set to name,
      name,
      // attributeNamespace set to namespace,
      namespace,
      // oldValue set to mappedOldValue,
      mappedOldValue,
      // addedNodes set to addedNodes,
      new StaticNodeList(addedNodes),
      //  removedNodes set to removedNodes,
      new StaticNodeList(removedNodes),
      // previousSibling set to previousSibling,
      previousSibling,
      // and nextSibling set to nextSibling.
      nextSibling,
    );

    // 2. Enqueue record to observer’s record queue.
    $(observer).recordQueue.enqueue(record);

    // 3. Append observer to the surrounding agent’s pending mutation observers.
    surroundingAgent.pendingMutationObservers.append(observer);
  }

  // 5. Queue a mutation observer microtask.
  queueMutationObserverMicrotask();
}
