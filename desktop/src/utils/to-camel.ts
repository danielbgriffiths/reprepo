// Third Party Imports
import * as changeCase from "change-case/keys";

export function toCamel<T extends object>(object: object): T {
  return changeCase.camelCase(object, 5) as T;
}
