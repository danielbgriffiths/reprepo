// Third Party Imports
import { InvokeArgs } from "@tauri-apps/api/tauri";
import { invoke } from "@tauri-apps/api";

// Local Imports
import { Commands } from "@services/commands/index.types";

export async function getEnv(args: InvokeArgs): Promise<string | undefined> {
  try {
    const result = await invoke<string>(Commands.GetEnv, args);

    console.info("general.commands: getEnv: ", result);

    return result;
  } catch (e) {
    console.error("getEnv: ", e);
    return undefined;
  }
}
