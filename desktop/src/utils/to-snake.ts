// Third Party Imports
import * as changeCase from "change-case/keys";

export function toSnake<T extends Record<string, unknown>>(
  object: Record<string, unknown>,
): T {
  return changeCase.snakeCase(object, 5) as T;
}
