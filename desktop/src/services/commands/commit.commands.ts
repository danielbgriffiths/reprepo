// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import { ApiCommit, Commit } from "@/models";
import { toCamel, toSnake } from "@/utils";

interface CreateCommitPayload extends InvokeArgs {
  newCommit: {
    recordId: number;
    notes: string;
    title?: string;
  };
}

export async function createCommit(
  args: CreateCommitPayload,
): Promise<number | undefined> {
  try {
    const result = await invoke<number>(Commands.CreateCommit, {
      newCommit: toSnake(args.newCommit),
    });

    console.info("record.commands: createCommit: ", result);

    return result;
  } catch (e) {
    console.error("record.commands: createCommit: ", e);

    return undefined;
  }
}

export async function getCommits(
  args: InvokeArgs,
): Promise<Commit[] | undefined> {
  try {
    const result = await invoke<ApiCommit[]>(Commands.GetCommits, args);

    console.info("record.commands: getCommits: ", result);

    return toCamel<Commit[]>(result);
  } catch (e) {
    console.error("record.commands: getCommits: ", e);

    return undefined;
  }
}

export async function getCommitById(
  args: InvokeArgs,
): Promise<Commit | undefined> {
  try {
    const result = await invoke<ApiCommit>(Commands.GetCommit, args);

    console.info("record.commands: getCommitById: ", result);

    return toCamel<Commit>(result);
  } catch (e) {
    console.error("record.commands: getCommitById: ", e);

    return undefined;
  }
}
