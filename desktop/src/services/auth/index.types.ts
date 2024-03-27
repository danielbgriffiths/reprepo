// Third Party Imports
import { JSXElement } from "solid-js";

// Local Imports
import { Auth, AuthenticatedUser, User, AuthAccount } from "@/models";

export interface AuthStore {
  auth?: Auth;
  user?: User;
  authAccount?: AuthAccount;
  isInitialized: boolean;
}

export type AuthBindings = {
  store: AuthStore;
  setAuth: (_authenticatedUser?: AuthenticatedUser) => void;
  createAuthFromStronghold: () => Promise<void>;
  createGoogleOAuth: (_existingAuthId?: number) => Promise<void>;
};

export interface AuthProviderProps {
  children: JSXElement;
}
