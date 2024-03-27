// Third Party Imports
import { createStore } from "solid-js/store";

// Local Imports
import { AuthContext } from "./create-context";
import { AuthBindings, AuthProviderProps, AuthStore } from "../index.types";
import { AuthenticatedUser } from "@/models";
import { cmd } from "@services/commands/index.utils.ts";
import { Commands } from "@services/commands";
import { StrongholdKeys } from "@services/stronghold/index.config.ts";
import { useNotifications } from "@services/notifications";
import { useStronghold } from "@services/stronghold";

export function AuthProvider(props: AuthProviderProps) {
  //
  // Hooks
  //

  const stronghold = useStronghold();
  const [_, notificationActions] = useNotifications();

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

  function setAuth(
    authenticatedUser?: AuthenticatedUser,
    isNotInitialized?: boolean,
  ): void {
    setAuthStore((prev) => {
      return {
        ...prev,
        ...(authenticatedUser || {}),
        isInitialized: !isNotInitialized,
      };
    });
  }

  async function createGoogleOAuth(existingAuthId?: number): Promise<void> {
    const accountId = await stronghold.read(StrongholdKeys.AccountId);

    const authedSignatureResult = await cmd<string>(
      Commands.CreateGoogleOAuth,
      { existingAuthId, existingAccountId: accountId },
    );

    if (authedSignatureResult.error) {
      notificationActions.addNotification({
        message: <span>{authedSignatureResult.error.message}</span>,
        type: "error",
        duration: 5000,
        isRemovableByClick: true,
      });
      return;
    }

    await storeAuthedSignature(authedSignatureResult.data!);

    const authenticatedUserResult = await cmd<AuthenticatedUser>(
      Commands.GetAuthenticatedUser,
      {
        authedSignature: authedSignatureResult.data!,
        accountId,
      },
    );

    if (authenticatedUserResult.error) {
      await removeAuthedSignature();
      notificationActions.addNotification({
        message: <span>{authenticatedUserResult.error.message}</span>,
        type: "error",
        duration: 5000,
        isRemovableByClick: true,
      });
      return;
    }

    setAuth(authenticatedUserResult.data);
  }

  async function createAuthFromStronghold(): Promise<void> {
    const accountId = await stronghold.read(StrongholdKeys.AccountId);

    const authedSignature = await stronghold.read(
      StrongholdKeys.AuthedSignature,
    );

    if (!authedSignature) {
      setAuth(undefined, true);
      return;
    }

    const authenticatedUserResult = await cmd<AuthenticatedUser>(
      Commands.GetAuthenticatedUser,
      {
        authedSignature,
        accountId,
      },
    );

    if (authenticatedUserResult.error) {
      notificationActions.addNotification({
        message: <span>{authenticatedUserResult.error.message}</span>,
        type: "error",
        duration: 5000,
        isRemovableByClick: true,
      });
      await removeAuthedSignature();
      return;
    }

    setAuth(authenticatedUserResult.data);
  }

  async function storeAuthedSignature(authedSignature: string): Promise<void> {
    await stronghold.insert(StrongholdKeys.AuthedSignature, authedSignature, {
      save: true,
    });
  }

  async function removeAuthedSignature(): Promise<void> {
    await stronghold.remove(StrongholdKeys.AuthedSignature, { save: true });
  }

  const authBindings: AuthBindings = {
    store: authStore,
    setAuth,
    createGoogleOAuth,
    createAuthFromStronghold,
  };

  return (
    <AuthContext.Provider value={authBindings}>
      {props.children}
    </AuthContext.Provider>
  );
}
