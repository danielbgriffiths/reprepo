// Third Party Imports
import { JSXElement } from "solid-js";

// Local Imports
import { Auth, AuthenticatedUser, User, AuthAccount } from "@/models";

export interface AuthStore {
  auth?: Auth;
  user?: User;
  authAccount?: AuthAccount;
  isInitialized: boolean;
  localAccountId?: number;
  activeRepositoryId?: number;
}

export type AuthBindings = {
  store: AuthStore;
  setActiveRepositoryId: (repositoryId: number) => Promise<void>;
  hydrateLocalAccountId: () => Promise<void>;
  setAuth: (_authenticatedUser?: AuthenticatedUser) => void;
  updateUser: (partialUser: Partial<User>) => void;
  createAuthFromStronghold: () => Promise<void>;
  createGoogleOAuth: (_existingAuthId?: number) => Promise<void>;
};

export interface AuthProviderProps {
  children: JSXElement;
}
