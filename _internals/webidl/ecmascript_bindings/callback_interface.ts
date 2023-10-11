import { isObject } from "../../../deps.ts";
import { Call, Get, IsCallable } from "../../../ecma/abstract_operations.ts";
import {
  CompletionRecord,
  empty,
  isAbruptCompletion,
  isCompletion,
  Type,
} from "../../../ecma/data_types.ts";
import { ReturnIfAbrupt } from "../../../ecma/notational_conventions.ts";

/**
 * @see [WebIDL Living Standard](https://webidl.spec.whatwg.org/#call-a-user-objects-operation)
 */
export function callUserObjectOperation(
  value: unknown,
  opName: string,
  args: unknown[],
  thisArg?: unknown, // 2. If thisArg was not given, let thisArg be undefined.
): unknown {
  // 1. Let completion be an uninitialized variable.
  let completion: unknown;

  // 3. Let O be the ECMAScript object corresponding to value.
  const O = Object(value);

  // 4. Let realm be O’s associated realm.

  // 5. Let relevant settings be realm’s settings object.

  // 6. Let stored settings be value’s callback context.

  // 7. Prepare to run script with relevant settings.

  // 8. Prepare to run a callback with stored settings.

  // 9. Let X be O.
  let X: unknown = O;

  // 10. If IsCallable(O) is false, then:
  if (!IsCallable(O)) {
    // 1. Let getResult be Completion(Get(O, opName)).
    const getResult = Get(O, opName);

    // 2. If getResult is an abrupt completion, set completion to getResult and jump to the step labeled return.
    if (isAbruptCompletion(getResult)) {
      completion = getResult;
      return Return();
    }

    // 3. Set X to getResult.[[Value]].
    X = getResult.Value;

    // 4. If IsCallable(X) is false, then set completion to Completion Record { [[Type]]: throw, [[Value]]: a newly created TypeError object, [[Target]]: empty }, and jump to the step labeled return.
    if (!IsCallable(X)) {
      completion = <CompletionRecord> {
        Type: Type.Throw,
        Value: new TypeError(),
        Target: empty,
      };
      return Return();
    }

    // 5. Set thisArg to O (overriding the provided value).
    thisArg = O;
  }

  // 11. Let esArgs be the result of converting args to an ECMAScript arguments list. If this throws an exception, set completion to the completion value representing the thrown exception and jump to the step labeled return.
  // TODO
  const esArgs = args;

  // 12. Let callResult be Completion(Call(X, thisArg, esArgs)).
  const callResult = Call(X, thisArg, esArgs);

  // 13. If callResult is an abrupt completion, set completion to callResult and jump to the step labeled return.
  if (isAbruptCompletion(callResult)) {
    completion = callResult;

    return Return();
  }

  // 14. Set completion to the result of converting callResult.[[Value]] to an IDL value of the same type as the operation’s return type.
  completion = callResult.Value;
  // If this throws an exception, set completion to the completion value representing the thrown exception.

  // 15. Return: at this point completion will be set to an IDL value or an abrupt completion.
  return Return();

  function Return(): unknown {
    // 1. Clean up after running a callback with stored settings.

    // 2. Clean up after running script with relevant settings.

    // 3. If completion is an IDL value, return completion.
    if (!isObject(completion) || !isCompletion(completion)) return completion;

    // 4. If completion is an abrupt completion and the operation has a return type that is not a promise type, throw completion.[[Value]].
    if (
      isAbruptCompletion(completion) && !(completion.Value instanceof Promise)
    ) throw completion.Value;

    // 5. Let rejectedPromise be ! Call(%Promise.reject%, %Promise%, «completion.[[Value]]»).
    const rejectedPromise = ReturnIfAbrupt(
      Call(Promise.reject, Promise, [completion.Value]),
    );

    // 6. Return the result of converting rejectedPromise to the operation’s return type.
    return rejectedPromise;
  }
}
