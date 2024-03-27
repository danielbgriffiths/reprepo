// Third Party Imports
import { useContext } from "solid-js";

// Local Imports
import { AuthContext } from "./create-context";
import { AuthBindings } from "../index.types";

export function useAuth(): AuthBindings {
  return useContext(AuthContext)!;
}
