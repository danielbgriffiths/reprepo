// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";

export async function createGoogleOAuth(
  args: InvokeArgs,
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

export async function logout(args: InvokeArgs): Promise<boolean | undefined> {
  try {
    const result = await invoke<boolean>(Commands.Logout, args);

    console.info("auth.commands: logout: ", result);

    return result;
  } catch (e) {
    console.error("auth.commands: logout: ", e);

    return undefined;
  }
}
