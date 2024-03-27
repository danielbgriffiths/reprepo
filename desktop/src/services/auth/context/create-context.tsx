// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import { AuthBindings } from "../index.types";
import { AuthenticatedUser } from "@/models";

export const AuthContext = createContext<AuthBindings>({
  store: {
    auth: undefined,
    user: undefined,
    authAccount: undefined,
    isInitialized: false,
  },
  setAuth: (_authenticatedUser?: AuthenticatedUser) => {},
  createAuthFromStronghold: async () => {},
  createGoogleOAuth: async (_existingAuthId?: number) => {},
});
