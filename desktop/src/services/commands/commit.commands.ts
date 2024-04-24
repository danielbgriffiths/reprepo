// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import { ApiCommit, Commit } from "@/models";

export async function createCommit(
  args: InvokeArgs,
): Promise<number | undefined> {
  try {
    const result = await invoke<number>(Commands.CreateCommit, args);

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

    return result.map(
      (record): Commit => ({
        id: record.id,
        notes: record.notes,
        recordId: record.record_id,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        deletedAt: record.deleted_at,
      }),
    );
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

    return {
      id: result.id,
      notes: result.notes,
      recordId: result.record_id,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      deletedAt: result.deleted_at,
    };
  } catch (e) {
    console.error("record.commands: getCommitById: ", e);

    return undefined;
  }
}
