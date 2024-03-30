// Third Party Imports
import { JSXElement } from "solid-js";

// Local Imports
import { Auth, AuthenticatedUser, User, AuthAccount } from "@/models";
import { DataBindings } from "@services/data";

export interface AuthStore {
  auth?: Auth;
  user?: User;
  authAccount?: AuthAccount;
  isInitialized: boolean;
}

export type AuthBindings = {
  store: AuthStore;
  setAuth: (_authenticatedUser?: AuthenticatedUser) => void;
  updateUser: (partialUser: Partial<User>) => void;
  createAuthFromStronghold: () => Promise<void>;
  createGoogleOAuth: (
    dataStore: DataBindings,
    _existingAuthId?: number,
  ) => Promise<void>;
};

export interface AuthProviderProps {
  children: JSXElement;
}
