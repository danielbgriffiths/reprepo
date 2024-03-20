// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import { AuthBindings } from "../index.types.ts";

export const AuthContext = createContext<AuthBindings>([
  () => undefined,
  () => {},
]);
