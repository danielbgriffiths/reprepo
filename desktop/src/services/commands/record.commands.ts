// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import { ApiRecord, Record } from "@/models";

export async function createRecord(
  args: InvokeArgs,
): Promise<number | undefined> {
  try {
    const result = await invoke<number>(Commands.CreateRecord, args);

    console.info("record.commands: createRepository: ", result);

    return result;
  } catch (e) {
    console.error("record.commands: createRepository: ", e);

    return undefined;
  }
}

export async function getRecords(
  args: InvokeArgs,
): Promise<Record[] | undefined> {
  try {
    const result = await invoke<ApiRecord[]>(Commands.GetRecords, args);

    console.info("record.commands: getRecordsByRepositoryId: ", result);

    return result.map(
      (record): Record => ({
        id: record.id,
        repositoryId: record.repository_id,
        parentId: record.parent_id,
        name: record.name,
        author: record.author,
        category: record.category,
        authoredAt: record.authored_at,
        startedAt: record.started_at,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        deletedAt: record.deleted_at,
      }),
    );
  } catch (e) {
    console.error("record.commands: getRecordsByRepositoryId: ", e);

    return undefined;
  }
}

export async function getRecordById(
  args: InvokeArgs,
): Promise<Record | undefined> {
  try {
    const result = await invoke<ApiRecord>(Commands.GetRecord, args);

    console.info("record.commands: getRecordById: ", result);

    return {
      id: result.id,
      repositoryId: result.repository_id,
      parentId: result.parent_id,
      name: result.name,
      author: result.author,
      category: result.category,
      authoredAt: result.authored_at,
      startedAt: result.started_at,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      deletedAt: result.deleted_at,
    };
  } catch (e) {
    console.error("record.commands: getRecordById: ", e);

    return undefined;
  }
}
