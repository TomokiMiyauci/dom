import { OrderedSet } from "../../infra/data_structures/set.ts";
import { $ } from "../internal.ts";
import { Agent } from "../../ecma/executable_coce_and_execution_context.ts";

import { ParseScript, ScriptRecord } from "../../ecma/scripts_and_modules.ts";
import {
  Origin,
  PolicyContainer,
} from "../loading_web_pages/supporting_concepts.ts";
import { BrowsingContext } from "../loading_web_pages/infrastructure_for_sequences_of_documents/browsing_context.ts";
import { fetch } from "../../fetch/fetching.ts";
import { createPotentialCORSRequest } from "../infra/fetching_resource.ts";
import { FetchController } from "../../fetch/infrastructure.ts";

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
  return $(platformObject).realm["[[AgentSignifier]]"];
}

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

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#script-structs)
 */
export interface Script {
  settingsObject: EnvironmentSettingsObject;

  record: ScriptRecord | null;

  parseError: unknown | null;

  errorRethrow: unknown;

  FetchOptions: ScriptFetchOptions;

  baseURL: URL | null;
}

export interface ClassicScript extends Script {
  mutedErrors: boolean;

  record: ScriptRecord | null;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#script-fetch-options)
 */
export interface ScriptFetchOptions {
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#fetch-a-classic-script)
 */
export async function fetchClassicScript(
  url: URL,
  settingsObject: EnvironmentSettingsObject,
  options: ScriptFetchOptions,
  corsSetting: unknown,
  encoding: unknown,
  onComplete: (script: ClassicScript | null) => void,
): Promise<FetchController> {
  // 1. Let request be the result of creating a potential-CORS request given url, "script", and corsSetting.
  const request = createPotentialCORSRequest(url, "script", corsSetting);

  // 2. Set request's client to settingsObject.
  $(request).client = settingsObject;

  // 3. Set request's initiator type to "script".
  $(request).initiatorType = "script";

  // 4. Set up the classic script request given request and options.

  // 5. Fetch request with the following processResponseConsumeBody steps given response response and null, failure, or a byte sequence bodyBytes:
  return fetch(
    request,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    (response, bodyBytes) => {
      // 1. Set response to response's unsafe response.

      // 2. If any of the following are true:
      // - bodyBytes is null or failure; or
      // - response's status is not an ok status,
      if (!bodyBytes) {
        // then run onComplete given null, and abort these steps.
        onComplete(null);
        return;
      }

      const sourceText = new TextDecoder().decode(bodyBytes);

      // 7. Let script be the result of creating a classic script given sourceText, settingsObject, response's URL, options, and mutedErrors.
      const script = createClassicScript(
        sourceText,
        {} as any,
        $(response).url!,
        {},
        // TODO
      );

      // 8. Run onComplete given script.
      onComplete(script);
    },
  );
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#import-map-parse-result)
 */
export interface ImportMapParseResult {
  importMap: ImportMap;

  errorToRethrow: unknown;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#run-a-classic-script)
 */
export function runClassicScript(
  script: ClassicScript,
  rethrowErrors = false,
): void {
  const sourceCode = script.record!["[[ECMAScriptCode]]"]!;
  const sourceText = sourceCode.replace(new RegExp(`^"use strict";`), "");

  eval?.(sourceText);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#import-map)
 */
export interface ImportMap {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#impr-import-map)
   */
  imports: unknown;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#impr-error-to-rethrow)
   */
  scopes: unknown;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#creating-a-classic-script)
 */
export function createClassicScript(
  source: string,
  settings: EnvironmentSettingsObject,
  baseURL: URL,
  options: ScriptFetchOptions,
  mutedErrors = false,
) {
  // 1. If mutedErrors is true, then set baseURL to about:blank.
  if (mutedErrors) baseURL = new URL("about:blank");

  // 2. If scripting is disabled for settings, then set source to the empty string.

  // 3. Let script be a new classic script that this algorithm will subsequently initialize.
  const script: ClassicScript = {
    // 4. Set script's settings object to settings.
    settingsObject: settings,
    // 5. Set script's base URL to baseURL.
    baseURL,
    // 6. Set script's fetch options to options.
    FetchOptions: options,
    // 7. Set script's muted errors to mutedErrors.
    mutedErrors,
    // 8. Set script's parse error and error to rethrow to null.
    parseError: null,
    errorRethrow: null,
    record: null,
  };

  // 9. Let result be ParseScript(source, settings's realm, script).
  const result = ParseScript(source, settings as any, script);

  script.record = result;

  return script;
}
