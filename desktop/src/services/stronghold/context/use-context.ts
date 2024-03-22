// Third Party Imports
import { useContext } from "solid-js";

// Local Imports
import { StrongholdBindings } from "../index.types";
import { StrongholdContext } from "./create-context";

export function useStronghold(): StrongholdBindings {
  return useContext(StrongholdContext)!;
}
