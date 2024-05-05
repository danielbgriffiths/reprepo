// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";

interface CreateGoogleOAuthPayload extends InvokeArgs {
  existingAuthId?: number;
  existingAccountId?: number;
}

interface LogoutPayload extends InvokeArgs {
  authId: number;
  accountId?: number;
}

export async function createGoogleOAuth(
  args: CreateGoogleOAuthPayload,
): Promise<[string, number] | undefined> {
  try {
    const result = await invoke<[string, number]>(
      Commands.CreateGoogleOAuth,
      args,
    );

    console.info("auth.commands: createGoogleOAuth: ", result);

    return result;
  } catch (e) {
    console.error("auth.commands: createGoogleOAuth: ", e);

    return undefined;
  }
}

export async function logout(
  args: LogoutPayload,
): Promise<boolean | undefined> {
  try {
    const result = await invoke<boolean>(Commands.Logout, args);

    console.info("auth.commands: logout: ", result);

    return result;
  } catch (e) {
    console.error("auth.commands: logout: ", e);

    return undefined;
  }
}
