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

export type UseAuthenticateBindings = [
  Accessor<boolean>,
  Accessor<string | undefined>,
  (userId?: number) => Promise<void>,
];

export function useAuthenticate(): UseAuthenticateBindings {
  //
  // Hooks
  //

  const stronghold = useStronghold();
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useAuth();

  //
  // State
  //

  const [isAuthStateInitializing, setIsAuthStateInitializing] =
    createSignal<boolean>(true);
  const [authFlowError, setAuthFlowError] = createSignal<string | undefined>();

  const reactWithStrongholdRead = createReaction(createAuthFromStronghold);

  //
  // Lifecycle
  //

  if (stronghold.isInitialized()) {
    createAuthFromStronghold()
      .then(() => console.info("Stronghold authentication complete."))
      .catch((e) =>
        console.error("Error during stronghold authentication: ", e),
      );
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
      setAuthFlowError(authedSignatureResult.error.message);
      return;
    }

    await storeAuthedSignature(authedSignatureResult.data!);

    const authenticatedUserSummaryResult = await cmd<UserSummary>(
      Commands.GetAuthenticatedUserSummary,
      { authedSignature: authedSignatureResult.data! },
    );

    if (authenticatedUserSummaryResult.error) {
      await removeAuthedSignature();
      setAuthFlowError(authenticatedUserSummaryResult.error.message);
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
      setAuthFlowError(authenticatedUserSummary.error.message!);
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

  return [isAuthStateInitializing, authFlowError, createGoogleOAuth];
}
