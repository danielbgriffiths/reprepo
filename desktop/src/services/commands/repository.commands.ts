// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import { Repository } from "@/models";

export async function createRepository(
  args: InvokeArgs,
): Promise<number | undefined> {
  try {
    const result = await invoke<number>(Commands.CreateRepository, args);

    console.info("createRepository: ", result);

    return result;
  } catch (e) {
    console.error("createRepository: ", e);

    return undefined;
  }
}

export async function getRepositories(
  args: InvokeArgs,
): Promise<Repository[] | undefined> {
  try {
    const result = await invoke<Repository[]>(Commands.GetRepositories, args);

    console.info("getRepositories: ", result);

    return result;
  } catch (e) {
    console.error("getRepositories: ", e);

    return undefined;
  }
}
