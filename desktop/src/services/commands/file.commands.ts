// Third Party Imports
import { InvokeArgs } from "@tauri-apps/api/tauri";
import { invoke } from "@tauri-apps/api";

// Local Imports
import { Commands } from "@services/commands/index.types.ts";

export async function deleteFile(
  args: InvokeArgs,
): Promise<boolean | undefined> {
  try {
    const result = await invoke<boolean>(Commands.DeleteFile, args);

    console.info("file.commands: deleteFile: ", result);

    return result;
  } catch (e) {
    console.error("file.commands: deleteFile: ", e);

    return undefined;
  }
}

export async function uploadFile(
  args: InvokeArgs,
): Promise<string | undefined> {
  try {
    const result = await invoke<string>(Commands.UploadFile, args);

    console.info("file.commands: uploadFile: ", result);

    return result;
  } catch (e) {
    console.error("file.commands: uploadFile: ", e);

    return undefined;
  }
}
