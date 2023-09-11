import {
  AbruptCompletion,
  CompletionRecord,
  isAbruptCompletion,
} from "./data_types.ts";

export function ReturnIfAbrupt<T>(
  completion: CompletionRecord<T>,
): T | AbruptCompletion<T> {
  if (isAbruptCompletion(completion)) return completion;

  return completion.Value;
}
