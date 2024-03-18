// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { useNavigate } from "@solidjs/router";
import { Accessor, createEffect, createReaction, createSignal } from "solid-js";

// Local Imports
import { Commands } from "@services/commands";
import { UserSummary } from "@/models";
import { useStronghold } from "@services/stronghold";
import { useAuth } from "@services/auth";
import { StrongholdKeys } from "@services/stronghold/index.config";

export type UseAuthenticateBindings = [
  Accessor<boolean>,
  Accessor<string | undefined>,
  () => Promise<void>,
  (userSummaryId: number) => Promise<void>,
];

export function useAuthenticate(): UseAuthenticateBindings {
  //
  // Hooks
  //

  const stronghold = useStronghold();
  const auth = useAuth();
  const navigate = useNavigate();

  //
  // State
  //

  const [isAuthStateInitializing, setIsAuthStateInitializing] =
    createSignal<boolean>(true);
  const [authFlowError, setAuthFlowError] = createSignal<string | undefined>();

  const reactWithStrongholdRead = createReaction(async () => {
    try {
      const authedSignature = await stronghold.read(
        StrongholdKeys.AuthedSignature,
      );

      if (!authedSignature) {
        setIsAuthStateInitializing(false);
        return;
      }

      const authenticatedUserSummary = await invoke<UserSummary>(
        Commands.GetAuthenticatedUserSummary,
        { authedSignature },
      );

      if (!authenticatedUserSummary) {
        setAuthFlowError(
          "Unable to fetch user associated with auth signature, automatically logging out",
        );
        await removeAuthedSignature();
        return;
      }

      auth.setActiveUser(authenticatedUserSummary);
    } catch (e) {
      console.error("reactWithStrongholdRead: ", e);
    }
  });

  //
  // Lifecycle
  //

  reactWithStrongholdRead(() => stronghold.isInitialized());

  createEffect(() => {
    if (!auth.activeUser()) return;
    setIsAuthStateInitializing(false);
    navigate("/auth/dashboard", { replace: true });
  });

  //
  // Event Handlers
  //

  async function createGoogleOAuth(): Promise<void> {
    try {
      const authedSignature = await invoke<string>(Commands.CreateGoogleOAuth);

      if (authedSignature) {
        setAuthFlowError(
          "Unable to fetch authed signature, possibly duplicate account or server error.",
        );
        return;
      }

      await storeAuthedSignature(authedSignature);

      const authenticatedUserSummary = await invoke<UserSummary>(
        Commands.GetAuthenticatedUserSummary,
        { authedSignature },
      );

      if (!authenticatedUserSummary) {
        await removeAuthedSignature();
        setAuthFlowError("Unable to fetch user associated with auth signature");
        return;
      }

      auth.setActiveUser(authenticatedUserSummary);
    } catch (e) {
      console.error("createGoogleOAuth: ", e);
    }
  }

  async function accessGoogleOAuth(userSummaryId: number): Promise<void> {
    try {
      const authedSignature = await invoke<string>(Commands.AccessGoogleOAuth, {
        id: userSummaryId,
      });

      if (authedSignature) {
        setAuthFlowError(
          "Unable to fetch authed signature, possibly server error",
        );
        return;
      }

      await storeAuthedSignature(authedSignature);

      const authenticatedUserSummary = await invoke<UserSummary>(
        Commands.GetAuthenticatedUserSummary,
        { authedSignature },
      );

      if (!authenticatedUserSummary) {
        await removeAuthedSignature();
        setAuthFlowError("Unable to fetch user associated with auth signature");
        return;
      }

      auth.setActiveUser(authenticatedUserSummary);
    } catch (e) {
      console.error("accessGoogleOAuth: ", e);
    }
  }

  //
  // Functions
  //

  async function storeAuthedSignature(authedSignature: string): Promise<void> {
    try {
      await stronghold.insert(StrongholdKeys.AuthedSignature, authedSignature);
      await stronghold.save();
    } catch (e) {
      console.error("storeUserSummary: ", e);
    }
  }

  async function removeAuthedSignature(): Promise<void> {
    try {
      await stronghold.remove(StrongholdKeys.AuthedSignature);
      await stronghold.save();
    } catch (e) {
      console.error("removeAuthedSignature: ", e);
    }
  }

  return [
    isAuthStateInitializing,
    authFlowError,
    createGoogleOAuth,
    accessGoogleOAuth,
  ];
}
