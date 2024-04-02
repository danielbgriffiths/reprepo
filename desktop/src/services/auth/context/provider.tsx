// Third Party Imports
import { createStore } from "solid-js/store";

// Local Imports
import { AuthContext } from "./create-context";
import { AuthBindings, AuthProviderProps, AuthStore } from "../index.types";
import { AuthenticatedUser, User } from "@/models";
import { authCommands, userCommands } from "@services/commands";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { useStronghold } from "@services/stronghold";
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
    localAccountId: undefined,
    activeRepositoryId: undefined,
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

  async function setActiveRepositoryId(
    activeRepositoryId: number,
  ): Promise<void> {
    setAuthStore("activeRepositoryId", activeRepositoryId);

    await stronghold.insertWithParse(
      StrongholdKeys.ActiveRepository,
      {
        key: authStore.user!.id,
        value: activeRepositoryId.toString(),
      },
      { save: true },
    );
  }

  async function hydrateLocalAccountId(): Promise<void> {
    const savedAccountId = await stronghold.read(StrongholdKeys.AccountId);

    if (!savedAccountId) return;

    setAuthStore("localAccountId", Number(savedAccountId));
  }

  async function storeLocalAccountId(accountId?: number): Promise<void> {
    if (!accountId) {
      return await stronghold.remove(StrongholdKeys.AccountId, { save: true });
    }

    await stronghold.insert(StrongholdKeys.AccountId, String(accountId), {
      save: true,
    });

    const savedAccountId = await stronghold.read(StrongholdKeys.AccountId);

    setAuthStore(
      "localAccountId",
      savedAccountId ? Number(savedAccountId) : undefined,
    );
  }

  function setAuth(authenticatedUser?: AuthenticatedUser): void {
    setAuthStore((prev) => ({
      ...prev,
      ...(authenticatedUser || {}),
      isInitialized: true,
    }));
  }

  async function createGoogleOAuth(existingAuthId?: number): Promise<void> {
    const authedSignature = await authCommands.createGoogleOAuth({
      existingAuthId,
      existingAccountId: authStore.localAccountId,
    });

    if (!authedSignature) {
      return notifications.register(NotificationKey.AuthSignatureError);
    }

    await storeLocalAccountId(authedSignature[1]);

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
    setActiveRepositoryId,
    hydrateLocalAccountId,
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
