// Third Party Imports
import { createStore } from "solid-js/store";
import { onMount } from "solid-js";
import { Event, listen } from "@tauri-apps/api/event";

// Local Imports
import { AuthContext } from "./create-context";
import { AuthBindings, AuthProviderProps, AuthStore } from "../index.types";
import { AuthenticatedUser, User } from "@/models";
import { authCommands, userCommands } from "@services/commands";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { useStronghold } from "@services/stronghold";
import { ToastKey, useToast } from "@services/toast";
import { Events, EventState, ResizeAvatarResponse } from "@services/events";
import { ExistingToast } from "@services/toast/index.types.ts";

export function AuthProvider(props: AuthProviderProps) {
  //
  // Hooks
  //

  const stronghold = useStronghold();
  const toast = useToast();

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
  // Lifecycle
  //

  onMount(async () => {
    const stopListen = await listen(
      Events.ResizeAvatar,
      async (event: Event<ResizeAvatarResponse>) => {
        let existingToast!: ExistingToast;

        switch (event.payload.state) {
          case EventState.Started:
            existingToast = toast.register(ToastKey.ResizeAvatar);
            break;
          case EventState.InProgress:
            if (!existingToast) return;
            toast.updateProgress(existingToast, event.payload.percentage);
            break;
          case EventState.Completed:
            if (!existingToast) return;
            toast.close(existingToast.id);
            break;
          case EventState.Failed:
            if (!existingToast) return;
            toast.updateError(existingToast, event.payload.error);
            break;
          default:
            break;
        }
      },
    );

    return () => stopListen();
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
    if (!activeRepositoryId) {
      return await stronghold.remove(StrongholdKeys.ActiveRepository, {
        save: true,
      });
    }

    await stronghold.insertWithParse(
      StrongholdKeys.ActiveRepository,
      {
        key: authStore.user!.id,
        value: activeRepositoryId.toString(),
      },
      { save: true },
    );

    await hydrateActiveRepositoryId();
  }

  async function hydrateActiveRepositoryId(): Promise<void> {
    const activeRepositoryId = await stronghold.readWithParse(
      StrongholdKeys.ActiveRepository,
      authStore.user!.id,
    );

    if (!activeRepositoryId) return;

    setAuthStore("activeRepositoryId", Number(activeRepositoryId));
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
      toast.register(ToastKey.AuthSignatureError);
      return;
    }

    await storeLocalAccountId(authedSignature[1]);

    await storeAuthedSignature(authedSignature[0]);

    const authenticatedUser = await userCommands.getAuthenticatedUser({
      authedSignature: authedSignature[0],
      accountId: authedSignature[1],
    });

    if (!authenticatedUser) {
      await removeAuthedSignature();
      toast.register(ToastKey.AuthenticatedUserError);
      return;
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
      setAuth(undefined);
      toast.register(ToastKey.AuthenticatedUserError);
      return;
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
    hydrateActiveRepositoryId,
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
