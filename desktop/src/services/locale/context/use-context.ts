// Third Party Imports
import { useContext } from "solid-js";

// Local Imports
import { LocaleContext } from "./create-context";
import { LocaleBindings } from "../index.types";

export function useLocale(): LocaleBindings {
  return useContext(LocaleContext)!;
}
