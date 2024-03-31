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

    console.info("createGoogleOAuth: ", result);

    return result;
  } catch (e) {
    console.error("createGoogleOAuth: ", e);

    return undefined;
  }
}

export async function logout(args: InvokeArgs): Promise<boolean | undefined> {
  try {
    const result = await invoke<boolean>(Commands.Logout, args);

    console.info("logout: ", result);

    return result;
  } catch (e) {
    console.error("logout: ", e);

    return undefined;
  }
}
