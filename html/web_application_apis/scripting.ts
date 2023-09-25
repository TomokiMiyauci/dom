import { OrderedSet } from "../../infra/data_structures/set.ts";
import { $, internalSlots } from "../internal.ts";
import {
  Agent,
  RealmRecord,
} from "../../ecma/executable_coce_and_execution_context.ts";
import {
  Origin,
  PolicyContainer,
} from "../loading_web_pages/supporting_concepts.ts";
import { BrowsingContext } from "../loading_web_pages/infrastructure_for_sequences_of_documents/browsing_context.ts";

export function queueTask(
  source: unknown,
  steps: unknown,
  eventLoop: EventLoop,
  document: Document | null = impliedDocument(eventLoop, {}),
) {
  // 1. If event loop was not given, set event loop to the implied event loop.
  // 2. If document was not given, set document to the implied document.

  // 3. Let task be a new task.
  const task: Task = {
    // 4. Set task's steps to steps.
    steps,
    // 5. Set task's source to source.
    source,
    // 6. Set task's document to the document.
    document,
    // 7. Set task's script evaluation environment settings object set to an empty set.
    scriptEvaluationEnvironmentSettingsObjectSet: new OrderedSet(),
  };

  // 8. Let queue be the task queue to which source is associated on event loop.
  const queue = eventLoop.taskQueues;

  // 9. Append task to queue.
  queue.append(task);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-global-task)
 */
export function queueGlobalTask(
  source: unknown,
  global: object,
  steps: unknown,
): void {
  // 1/ Let event loop be global's relevant agent's event loop.
  // const eventLoop = $(relevantAgent(global));

  // 2. Let document be global's associated Document, if global is a Window object; otherwise null.
  const document = null;

  // 3. Queue a task given source, event loop, document, and steps.
  queueTask(source, steps, eventLoop, document);
}

export function impliedDocument(
  eventLoop: EventLoop,
  task: unknown,
): Document | null {
  return null;
}

export interface EventLoop {
  taskQueues: OrderedSet<Task>;
}

const eventLoop: EventLoop = { taskQueues: new OrderedSet() };

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task)
 */
export interface Task {
  steps: unknown;

  source: unknown;

  document: Document | null;

  scriptEvaluationEnvironmentSettingsObjectSet: OrderedSet<unknown>;
}

export function relevantAgent(platformObject: object): Agent {
  console.log(platformObject);
  return $(platformObject).realm["[[AgentSignifier]]"];
}

const realm = new RealmRecord();
internalSlots.extends(Object.prototype, { realm });

const agent = realm["[[AgentSignifier]]"];
internalSlots.extends(agent, { taskQueues: new OrderedSet() });

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#environment)
 */
export interface Environment {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#concept-environment-id)
   */
  id: string;

  creationURL: URL;

  topLevelCreationURL: URL | null;

  topLevelOrigin: Origin | null;

  targetBrowsingContext: BrowsingContext | null;

  activeServiceWorker: unknown;

  executionReadyFlag: boolean;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-object)
 */
export interface EnvironmentSettingsObject extends Environment {
  realmExecutionContext: unknown;

  moduleMap: unknown;

  APIBaseURL: URL;

  origin: Origin;

  policyContainer: PolicyContainer;

  crossOriginIsolatedCability: boolean;

  timeOrigin: number;
}
