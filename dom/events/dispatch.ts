import { Event, type PotentialEventTarget, type Struct } from "./event.ts";
import { Node } from "../nodes/node.ts";
import { type EventListener, type EventTarget } from "./event_target.ts";
import { retarget } from "../nodes/shadow_root_utils.ts";
import { type ShadowRoot } from "../nodes/shadow_root.ts";
import { List } from "../../infra/data_structures/list.ts";
import { isSlottable } from "../nodes/node_trees/node_tree.ts";
import { getRoot, isTree } from "../infra/tree.ts";
import { isNodeLike, isShadowRoot } from "../nodes/utils.ts";
import { ifilter, last, lastItem, some } from "../../deps.ts";
import { callUserObjectOperation } from "../../webidl/ecmascript_bindings/callback_interface.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-event-dispatch)
 */
export function dispatch(
  event: Event,
  target: EventTarget,
  legacyTargetOverride?: boolean,
  legacyOutputDidListenersThrowFlag = false,
): boolean {
  // 1. Set event’s dispatch flag.
  event["_dispatch"] = true;

  // 2. Let targetOverride be target, if legacy target override flag is not given, and target’s associated Document otherwise.
  const targetOverride = typeof legacyTargetOverride === "undefined"
    ? target
    // TODO
    : target;

  // 3. Let activationTarget be null.
  let activationTarget = null;

  // 4. Let relatedTarget be the result of retargeting event’s relatedTarget against target.
  const relatedTarget = retarget(event["_relatedTarget"], target);

  let clearTargets = false;

  // 5. If target is not relatedTarget or target is event’s relatedTarget, then:
  if (target !== relatedTarget || target === event["_relatedTarget"]) {
    // 1. Let touchTargets be a new list.
    const touchTargets = new List<PotentialEventTarget>();

    // 2. For each touchTarget of event’s touch target list, append the result of retargeting touchTarget against target to touchTargets.
    for (const touchTarget of event["_touchTargetList"]) {
      const result = retarget(touchTarget, target);
      touchTargets.append(result);
    }

    // 3. Append to an event path with event, target, targetOverride, relatedTarget, touchTargets, and false.
    appendEventPath(
      event,
      target,
      targetOverride,
      relatedTarget,
      touchTargets,
      false,
    );

    // 4. Let isActivationEvent be true, if event is a MouseEvent object and event’s type attribute is "click"; otherwise false.
    // TODO
    const isActivationEvent = false;

    // 5. If isActivationEvent is true and target has activation behavior, then set activationTarget to target.
    if (isActivationEvent && target["_activationBehavior"]) {
      activationTarget = target;
    }

    // 6. Let slottable be target, if target is a slottable and is assigned, and null otherwise.
    // TODO
    let slottable = isNodeLike(target) && isSlottable(target as any)
      ? target
      : null;

    // 7. Let slot-in-closed-tree be false.
    let slotInClosedTree = false;

    // 8. Let parent be the result of invoking target’s get the parent with event.
    let parent = target["_getParent"](event);

    // 9. While parent is non-null:
    while (parent) {
      // 1. If slottable is non-null:
      if (slottable) {
        // 1. Assert: parent is a slot.
        parent = parent as Node;

        // 2. Set slottable to null.
        slottable = null;

        // 3. If parent’s root is a shadow root whose mode is "closed", then set slot-in-closed-tree to true.
        const root = getRoot(parent as Node) as Node;
        if (isShadowRoot(root) && root["_mode"] === "closed") {
          slotInClosedTree = true;
        }
      }

      // 2. If parent is a slottable and is assigned, then set slottable to parent.
      // TODO
      if (isNodeLike(parent) && isSlottable(parent as any)) slottable = parent;

      // 3. Let relatedTarget be the result of retargeting event’s relatedTarget against parent.
      const relatedTarget = retarget(event["_relatedTarget"], parent);

      // 4. Let touchTargets be a new list.
      const touchTargets = new List<PotentialEventTarget>();

      // 5. For each touchTarget of event’s touch target list, append the result of retargeting touchTarget against parent to touchTargets.
      for (const touchTarget of event["_touchTargetList"]) {
        const result = retarget(touchTarget, parent);

        touchTargets.append(result);
      }

      // 6. If parent is a Window object, or parent is a node and target’s root is a shadow-including inclusive ancestor of parent, then:
      // 1. If isActivationEvent is true, event’s bubbles attribute is true, activationTarget is null, and parent has activation behavior, then set activationTarget to parent.
      // 2. Append to an event path with event, parent, null, relatedTarget, touchTargets, and slot-in-closed-tree.

      // 7. Otherwise, if parent is relatedTarget, then set parent to null.
      if (parent === relatedTarget) parent = null;
      // 8. Otherwise, set target to parent and then:
      else {
        target = parent;
        // 1. If isActivationEvent is true, activationTarget is null, and target has activation behavior, then set activationTarget to target.
        if (
          isActivationEvent && activationTarget === null &&
          target["_activationBehavior"]
        ) activationTarget = target;

        // 2. Append to an event path with event, parent, target, relatedTarget, touchTargets, and slot-in-closed-tree.
        appendEventPath(
          event,
          parent,
          target,
          relatedTarget,
          touchTargets,
          slotInClosedTree,
        );
      }

      // 9. If parent is non-null, then set parent to the result of invoking parent’s get the parent with event.
      if (parent) parent = parent["_getParent"](event);

      // 10. Set slot-in-closed-tree to false.
      slotInClosedTree = false;
    }

    const filtered = ifilter(
      event["_path"],
      (struct) => !!struct.shadowAdjustedTarget,
    );
    // 10. Let clearTargetsStruct be the last struct in event’s path whose shadow-adjusted target is non-null.
    const clearTargetsStruct = last(filtered);

    if (clearTargetsStruct) {
      // 11. Let clearTargets be true if clearTargetsStruct’s shadow-adjusted target, clearTargetsStruct’s relatedTarget, or an EventTarget object in clearTargetsStruct’s touch target list is a node and its root is a shadow root; otherwise false.
      if (
        some([
          clearTargetsStruct.shadowAdjustedTarget,
          clearTargetsStruct.relatedTarget,
          ...clearTargetsStruct.touchTargetList,
        ], (potential) => {
          return !!potential && isTree(potential) && isNodeLike(potential) &&
            isShadowRoot(getRoot(potential));
        })
      ) clearTargets = true;
    }

    // 12. If activationTarget is non-null and activationTarget has legacy-pre-activation behavior, then run activationTarget’s legacy-pre-activation behavior.
    if (activationTarget && activationTarget["_legacyPreActivationBehavior"]) {
      activationTarget["_legacyPreActivationBehavior"]();
    }

    // 13. For each struct in event’s path, in reverse order:
    for (const struct of [...event["_path"]].reverse()) {
      // 1. If struct’s shadow-adjusted target is non-null, then set event’s eventPhase attribute to AT_TARGET.
      if (struct.shadowAdjustedTarget) event["eventPhase"] = event.AT_TARGET;
      // 2. Otherwise, set event’s eventPhase attribute to CAPTURING_PHASE.
      else event["eventPhase"] = event.CAPTURING_PHASE;

      // 3. Invoke with struct, event, "capturing", and legacyOutputDidListenersThrowFlag if given.
      invoke(struct, event, "capturing", legacyOutputDidListenersThrowFlag);
    }

    // 14. For each struct in event’s path:
    for (const struct of event["_path"]) {
      // 1. If struct’s shadow-adjusted target is non-null, then set event’s eventPhase attribute to AT_TARGET.
      if (struct["shadowAdjustedTarget"]) event["eventPhase"] = event.AT_TARGET;
      // 2. Otherwise:
      else {
        // 1. If event’s bubbles attribute is false, then continue.
        if (!event.bubbles) continue;

        // 2. Set event’s eventPhase attribute to BUBBLING_PHASE.
        event["eventPhase"] = event.BUBBLING_PHASE;
      }

      // 3. Invoke with struct, event, "bubbling", and legacyOutputDidListenersThrowFlag if given.
      invoke(struct, event, "bubbling", legacyOutputDidListenersThrowFlag);
    }
  }

  // 6. Set event’s eventPhase attribute to NONE.
  event["eventPhase"] = event.NONE;

  // 7. Set event’s currentTarget attribute to null.
  event["currentTarget"] = null;

  // 8. Set event’s path to the empty list.
  event["_path"] = new List();

  // 9. Unset event’s dispatch flag, stop propagation flag, and stop immediate propagation flag.
  event["_dispatch"] = false,
    event["_stopPropagation"] = false,
    event["_stopImmediatePropagation"] = false;

  // 10. If clearTargets, then:
  if (clearTargets) {
    // 1. Set event’s target to null.
    event["_target"] = null;

    // 2. Set event’s relatedTarget to null.
    event["_relatedTarget"] = null;

    // 3. Set event’s touch target list to the empty list.
    event["_touchTargetList"] = new List();
  }

  // 11. If activationTarget is non-null, then:
  if (activationTarget) {
    // 1. If event’s canceled flag is unset, then run activationTarget’s activation behavior with event.
    if (!event["_canceled"]) activationTarget["_activationBehavior"]?.(event);
    // 2. Otherwise, if activationTarget has legacy-canceled-activation behavior, then run activationTarget’s legacy-canceled-activation behavior.
    else {
      if (activationTarget["_legacyCanceledActivation"]) {
        activationTarget["_legacyCanceledActivation"]();
      }
    }
  }

  // 12. Return false if event’s canceled flag is set; otherwise true.
  return !event["_canceled"];
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-event-path-append)
 */
export function appendEventPath(
  event: Event,
  invocationTarget: EventTarget,
  shadowAdjustedTarget: PotentialEventTarget,
  relatedTarget: PotentialEventTarget,
  touchTargets: List<PotentialEventTarget>,
  slotInClosedTree: boolean,
): void {
  // 1. Let invocationTargetInShadowTree be false.
  let invocationTargetInShadowTree = false;

  const resolved = resolveRoot(invocationTarget);

  // 2. If invocationTarget is a node and its root is a shadow root, then set invocationTargetInShadowTree to true.
  if (resolved.isShadowRoot) invocationTargetInShadowTree = true;

  // 3. Let root-of-closed-tree be false.
  let rootOfClosedTree = false;

  // 4. If invocationTarget is a shadow root whose mode is "closed", then set root-of-closed-tree to true.
  if (resolved.isShadowRoot && resolved.root["_mode"] === "closed") {
    rootOfClosedTree = true;
  }

  // 5. Append a new struct to event’s path whose invocation target is invocationTarget, invocation-target-in-shadow-tree is invocationTargetInShadowTree, shadow-adjusted target is shadowAdjustedTarget, relatedTarget is relatedTarget, touch target list is touchTargets, root-of-closed-tree is root-of-closed-tree, and slot-in-closed-tree is slot-in-closed-tree.
  event["_path"].append({
    invocationTarget,
    invocationTargetInShadowTree,
    shadowAdjustedTarget,
    relatedTarget,
    touchTargetList: touchTargets,
    rootOfClosedTree,
    slotInClosedTree,
  });
}

function resolveRoot(
  eventTarget: EventTarget,
): { isShadowRoot: false } | { isShadowRoot: true; root: ShadowRoot } {
  if (!isNodeLike(eventTarget)) return { isShadowRoot: false };

  const root = getRoot(eventTarget as Node);

  if (isShadowRoot(root)) return { isShadowRoot: true, root };

  return {
    isShadowRoot: false,
  };
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-event-listener-invoke)
 */
export function invoke(
  struct: Struct,
  event: Event,
  phase: string,
  legacyOutputDidListenersThrowFlag: boolean,
): void {
  const path = [...event["_path"]];
  const index = path.findIndex((item) => item === struct);
  const candidates = index > -1
    ? path.slice(0, index + 1).filter((struct) => !!struct.shadowAdjustedTarget)
    : [];
  const lastStruct = lastItem(candidates);

  // 1. Set event’s target to the shadow-adjusted target of the last struct in event’s path, that is either struct or preceding struct, whose shadow-adjusted target is non-null.
  if (lastStruct) event["_target"] = lastStruct.shadowAdjustedTarget;

  // 2. Set event’s relatedTarget to struct’s relatedTarget.
  event["_relatedTarget"] = struct.relatedTarget;

  // 3. Set event’s touch target list to struct’s touch target list.
  event["_touchTargetList"] = struct.touchTargetList;

  // 4. If event’s stop propagation flag is set, then return.
  if (event["_stopPropagation"]) return;

  // 5. Initialize event’s currentTarget attribute to struct’s invocation target.
  event["currentTarget"] = struct.invocationTarget;

  // 6. Let listeners be a clone of event’s currentTarget attribute value’s event listener list.
  const listeners = event.currentTarget?.["_eventListenerList"].clone() ??
    new List();

  // 7. Let invocationTargetInShadowTree be struct’s invocation-target-in-shadow-tree.
  const invocationTargetInShadowTree = struct.invocationTargetInShadowTree;

  // 8. Let found be the result of running inner invoke with event, listeners, phase, invocationTargetInShadowTree, and legacyOutputDidListenersThrowFlag if given.
  const found = innerInvoke(
    event,
    listeners,
    phase,
    invocationTargetInShadowTree,
    legacyOutputDidListenersThrowFlag,
  );

  // 9. If found is false and event’s isTrusted attribute is true, then:
  if (!found && event.isTrusted) {
    // 1. Let originalEventType be event’s type attribute value.
    const originalEventType = event.type;

    // 2. If event’s type attribute value is a match for any of the strings in the first column in the following table, set event’s type attribute value to the string in the second column on the same row as the matching string, and return otherwise.
    if (eventTypeMap.has(event.type)) {
      event["type"] = eventTypeMap.get(event.type)!;
    } else return;

    // 3. Inner invoke with event, listeners, phase, invocationTargetInShadowTree, and legacyOutputDidListenersThrowFlag if given.
    innerInvoke(
      event,
      listeners,
      phase,
      invocationTargetInShadowTree,
      legacyOutputDidListenersThrowFlag,
    );

    // 4. Set event’s type attribute value to originalEventType.
    event["type"] = originalEventType;
  }
}

/**
 * | Event type           | Legacy event type          |
 * | -------------------- | -------------------------- |
 * | "animationend"       | "webkitAnimationEnd"       |
 * | "animationiteration" | "webkitAnimationIteration" |
 * | "animationstart"     | "webkitAnimationStart"     |
 * | "transitionend"      | "webkitTransitionEnd"      |
 */
const eventTypeMap = new Map<string, string>([
  ["animationend", "webkitAnimationEnd"],
  ["animationiteration", "webkitAnimationIteration"],
  ["animationstart", "webkitAnimationStart"],
  ["transitionend", "webkitTransitionEnd"],
]);

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-event-listener-inner-invoke)
 */
export function innerInvoke(
  event: Event,
  listeners: Iterable<EventListener>,
  phase: string,
  invocationTargetInShadowTree: unknown,
  legacyOutputDidListenersThrowFlag?: boolean,
): boolean {
  // 1. Let found be false.
  let found = false;

  // 2. For each listener in listeners, whose removed is false:
  for (const listener of ifilter(listeners, (item) => !item.removed)) {
    // 1. If event’s type attribute value is not listener’s type, then continue.
    if (event.type !== listener.type) continue;

    // 2. Set found to true.
    found = true;

    // 3. If phase is "capturing" and listener’s capture is false, then continue.
    if (phase === "capturing" && !listener.capture) continue;

    // 4. If phase is "bubbling" and listener’s capture is true, then continue.
    if (phase === "bubbling" && listener.capture) continue;

    // 5. If listener’s once is true, then remove listener from event’s currentTarget attribute value’s event listener list.
    if (listener.once && event.currentTarget) {
      event.currentTarget["_eventListenerList"].remove((eventListener) =>
        eventListener === listener
      );
    }

    // 6. Let global be listener callback’s associated realm’s global object.

    // 7. Let currentEvent be undefined.
    let currentEvent = undefined;

    // 8. If global is a Window object, then:

    // 1. Set currentEvent to global’s current event.

    // 2. If invocationTargetInShadowTree is false, then set global’s current event to event.

    // 9. If listener’s passive is true, then set event’s in passive listener flag.
    if (listener.passive) event["_inPassiveListener"] = true;

    // 10. Call a user object’s operation with listener’s callback, "handleEvent", « event », and event’s currentTarget attribute value. If this throws an exception, then:
    try {
      callUserObjectOperation(
        listener.callback,
        "handleEvent",
        [event],
        event.currentTarget,
      );
    } catch {
      // 1. Report the exception.
      // TODO

      // 2. Set legacyOutputDidListenersThrowFlag if given.
      legacyOutputDidListenersThrowFlag = true;
    }

    // 11. Unset event’s in passive listener flag.
    event["_inPassiveListener"] = false;

    // 12. If global is a Window object, then set global’s current event to currentEvent.

    // 13. If event’s stop immediate propagation flag is set, then return found.
    if (event["_stopImmediatePropagation"]) return found;
  }

  // 3. Return found.
  return found;
}
