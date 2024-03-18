// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { useNavigate } from "@solidjs/router";
import { createEffect, createReaction } from "solid-js";

// Local Imports
import { Commands } from "@services/commands";
import { UserSummary } from "@/models";
import { useStronghold } from "@services/stronghold";
import { useAuth } from "@services/auth";
import { StrongholdKeys } from "@services/stronghold/index.config";

export type UseAuthenticateBindings = [
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

  const reactWithStrongholdRead = createReaction(async () => {
    try {
      const authedSignature = await stronghold.read(
        StrongholdKeys.AuthedSignature,
      );

      if (!authedSignature) return;

      const authenticatedUserSummary = await invoke<UserSummary>(
        Commands.GetAuthenticatedUserSummary,
        { authedSignature },
      );

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
    navigate("/auth/dashboard", { replace: true });
  });

  //
  // Event Handlers
  //

  async function createGoogleOAuth(): Promise<void> {
    try {
      const authedSignature = await invoke<string>(Commands.CreateGoogleOAuth);

      await storeAuthedSignature(authedSignature);

      const authenticatedUserSummary = await invoke<UserSummary>(
        Commands.GetAuthenticatedUserSummary,
        { authedSignature },
      );

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

      await storeAuthedSignature(authedSignature);

      const authenticatedUserSummary = await invoke<UserSummary>(
        Commands.GetAuthenticatedUserSummary,
        { authedSignature },
      );

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

  return [createGoogleOAuth, accessGoogleOAuth];
}
