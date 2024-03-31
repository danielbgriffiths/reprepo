// Third Party Imports
import { createStore } from "solid-js/store";

// Local Imports
import { AuthContext } from "./create-context";
import { AuthBindings, AuthProviderProps, AuthStore } from "../index.types";
import { AuthenticatedUser, User } from "@/models";
import { authCommands, userCommands } from "@services/commands";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { useStronghold } from "@services/stronghold";
import { DataBindings } from "@services/data";
import { NotificationKey } from "@services/notifications/index.types";
import { useNotifications } from "@services/notifications";

export function AuthProvider(props: AuthProviderProps) {
  //
  // Hooks
  //

  const stronghold = useStronghold();
  const notifications = useNotifications();

  //
  // State
  //

  const [authStore, setAuthStore] = createStore<AuthStore>({
    isInitialized: false,
    auth: undefined,
    user: undefined,
    authAccount: undefined,
  });

  //
  // Functions
  //

  function updateUser(partialUser: Partial<User>): void {
    setAuthStore(
      (prev: AuthStore): AuthStore => ({
        ...prev,
        user: {
          ...prev.user!,
          ...partialUser,
        },
      }),
    );
  }

  function setAuth(authenticatedUser?: AuthenticatedUser): void {
    setAuthStore((prev) => {
      return {
        ...prev,
        ...(authenticatedUser || {}),
        isInitialized: true,
      };
    });
  }

  async function createGoogleOAuth(
    dataStore: DataBindings,
    existingAuthId?: number,
  ): Promise<void> {
    const authedSignature = await authCommands.createGoogleOAuth({
      existingAuthId,
      existingAccountId: dataStore.general.store.accountId,
    });

    if (!authedSignature) {
      return notifications.register(NotificationKey.AuthSignatureError);
    }

    await dataStore.general.storeAccountId(authedSignature[1]);

    await storeAuthedSignature(authedSignature[0]);

    const authenticatedUser = await userCommands.getAuthenticatedUser({
      authedSignature: authedSignature[0],
      accountId: authedSignature[1],
    });

    if (!authenticatedUser) {
      await removeAuthedSignature();
      return notifications.register(NotificationKey.AuthenticatedUserError);
    }

    setAuth(authenticatedUser);
  }

  async function createAuthFromStronghold(): Promise<void> {
    const accountId = await stronghold.read(StrongholdKeys.AccountId);

    const authedSignature = await stronghold.read(
      StrongholdKeys.AuthedSignature,
    );

    if (!authedSignature) {
      return setAuth(undefined);
    }

    const authenticatedUser = await userCommands.getAuthenticatedUser({
      authedSignature,
      accountId: Number(accountId),
    });

    if (!authenticatedUser) {
      await removeAuthedSignature();
      return notifications.register(NotificationKey.AuthenticatedUserError);
    }

    setAuth(authenticatedUser);
  }

  async function storeAuthedSignature(authedSignature: string): Promise<void> {
    await stronghold.insert(StrongholdKeys.AuthedSignature, authedSignature, {
      save: true,
    });
  }

  async function removeAuthedSignature(): Promise<void> {
    await stronghold.remove(StrongholdKeys.AuthedSignature, { save: true });
  }

  //
  // Lifecycle
  //

  const authBindings: AuthBindings = {
    store: authStore,
    setAuth,
    updateUser,
    createGoogleOAuth,
    createAuthFromStronghold,
  };

  return (
    <AuthContext.Provider value={authBindings}>
      {props.children}
    </AuthContext.Provider>
  );
}
