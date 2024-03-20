// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import { AuthBindings } from "../index.types";

export const AuthContext = createContext<AuthBindings>([
  () => undefined,
  () => {},
]);
