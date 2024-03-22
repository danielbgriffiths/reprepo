// Third Party Imports
import { useNavigate } from "@solidjs/router";
import { Accessor, createEffect, createReaction, createSignal } from "solid-js";

// Local Imports
import { Commands } from "@services/commands";
import { UserSummary } from "@/models";
import { useStronghold } from "@services/stronghold";
import { useAuth } from "@services/auth";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { cmd } from "@services/commands/index.utils";
import { useNotifications } from "@services/notifications";

export type UseAuthenticateBindings = [
  Accessor<boolean>,
  (userId?: number) => Promise<void>,
];

export function useAuthenticate(): UseAuthenticateBindings {
  //
  // Hooks
  //

  const stronghold = useStronghold();
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useAuth();
  const [_, notificationActions] = useNotifications();

  //
  // State
  //

  const [isAuthStateInitializing, setIsAuthStateInitializing] =
    createSignal<boolean>(true);

  const reactWithStrongholdRead = createReaction(createAuthFromStronghold);

  //
  // Lifecycle
  //

  if (stronghold.isInitialized()) {
    createAuthFromStronghold().catch(console.error);
  } else {
    reactWithStrongholdRead(() => stronghold.isInitialized());
  }

  createEffect(() => {
    if (!activeUser()) return;
    setIsAuthStateInitializing(false);
    navigate("/auth/dashboard", { replace: true });
  });

  //
  // Event Handlers
  //

  async function createGoogleOAuth(existingUserId?: number): Promise<void> {
    const authedSignatureResult = await cmd<string>(
      Commands.CreateGoogleOAuth,
      { existingUserId },
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

    const authenticatedUserSummaryResult = await cmd<UserSummary>(
      Commands.GetAuthenticatedUserSummary,
      { authedSignature: authedSignatureResult.data! },
    );

    if (authenticatedUserSummaryResult.error) {
      await removeAuthedSignature();
      notificationActions.addNotification({
        message: <span>{authenticatedUserSummaryResult.error.message}</span>,
        type: "error",
        duration: 5000,
        isRemovableByClick: true,
      });
      return;
    }

    setActiveUser(authenticatedUserSummaryResult.data);
  }

  async function createAuthFromStronghold(): Promise<void> {
    const authedSignature = await stronghold.read(
      StrongholdKeys.AuthedSignature,
    );

    if (!authedSignature) {
      setIsAuthStateInitializing(false);
      return;
    }

    const authenticatedUserSummary = await cmd<UserSummary>(
      Commands.GetAuthenticatedUserSummary,
      { authedSignature },
    );

    if (authenticatedUserSummary.error) {
      notificationActions.addNotification({
        message: <span>{authenticatedUserSummary.error.message}</span>,
        type: "error",
        duration: 5000,
        isRemovableByClick: true,
      });
      await removeAuthedSignature();
      return;
    }

    setActiveUser(authenticatedUserSummary.data);
  }

  //
  // Functions
  //

  async function storeAuthedSignature(authedSignature: string): Promise<void> {
    await stronghold.insert(StrongholdKeys.AuthedSignature, authedSignature);
    await stronghold.save();
  }

  async function removeAuthedSignature(): Promise<void> {
    await stronghold.remove(StrongholdKeys.AuthedSignature);
    await stronghold.save();
  }

  return [isAuthStateInitializing, createGoogleOAuth];
}
