// Third Party Imports
import { useContext } from "solid-js";

// Local Imports
import { StrongholdBindings } from "../index.types.ts";
import { StrongholdContext } from "./create-context.tsx";

export function useStronghold(): StrongholdBindings {
  return useContext(StrongholdContext)!;
}
