// Third Party Imports
import { useContext } from "solid-js";

// Local Imports
import { StyleContext } from "./create-context";
import { StyleBindings } from "../index.types";

export function useStyle(): StyleBindings {
  return useContext(StyleContext)!;
}
