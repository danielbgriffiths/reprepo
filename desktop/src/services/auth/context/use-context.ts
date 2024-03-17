// Third Party Imports
import { useContext } from "solid-js";

// Local Imports
import { AuthContext } from "./create-context.tsx";
import { AuthBindings } from "../index.types.ts";

export function useAuth(): AuthBindings {
  return useContext(AuthContext);
}
