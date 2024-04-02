// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import { AuthBindings } from "../index.types";
import { AuthenticatedUser, User } from "@/models";

export const AuthContext = createContext<AuthBindings>({
  store: {
    auth: undefined,
    user: undefined,
    authAccount: undefined,
    isInitialized: false,
    localAccountId: undefined,
    activeRepositoryId: undefined,
  },
  setActiveRepositoryId: async (_repositoryId: number) => {},
  hydrateLocalAccountId: async () => {},
  setAuth: (_authenticatedUser?: AuthenticatedUser) => {},
  createAuthFromStronghold: async () => {},
  createGoogleOAuth: async (_existingAuthId?: number) => {},
  updateUser: (_partialUser: Partial<User>) => {},
});
