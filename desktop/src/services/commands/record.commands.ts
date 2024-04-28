// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import { ApiRecord, Record } from "@/models";

interface CreateRecordPayload extends InvokeArgs {
  newRecord: {
    repository_id: number;
    user_id: number;
    parent_id?: number;
    composition_meta_id: number;
    started_at: string;
  };
}

interface GetRecordsPayload extends InvokeArgs {
  targetRepositoryId: number;
}

interface GetRecordByIdPayload extends InvokeArgs {
  targetRecordId: number;
}

interface GetAuthorsPayload extends InvokeArgs {
  field: string;
  specialization: string;
}

interface GetNamesPayload extends GetAuthorsPayload {
  authors: string[];
}

export async function createRecord(
  args: CreateRecordPayload,
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
  args: GetRecordsPayload,
): Promise<Record[] | undefined> {
  try {
    const result = await invoke<ApiRecord[]>(Commands.GetRecords, args);

    console.info("record.commands: getRecords: ", result);

    return result.map(
      (record): Record => ({
        id: record.id,
        repositoryId: record.repository_id,
        parentId: record.parent_id,
        userId: record.user_id,
        compositionMetaId: record.composition_meta_id,
        startedAt: record.started_at,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        deletedAt: record.deleted_at,
      }),
    );
  } catch (e) {
    console.error("record.commands: getRecords: ", e);

    return undefined;
  }
}

export async function getRecordById(
  args: GetRecordByIdPayload,
): Promise<Record | undefined> {
  try {
    const result = await invoke<ApiRecord>(Commands.GetRecord, args);

    console.info("record.commands: getRecordById: ", result);

    return {
      id: result.id,
      repositoryId: result.repository_id,
      parentId: result.parent_id,
      userId: result.user_id,
      compositionMetaId: result.composition_meta_id,
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

export async function getAuthors(
  args: GetAuthorsPayload,
): Promise<string[] | undefined> {
  try {
    const result = await invoke<string[]>(Commands.GetAuthors, args);

    console.info("record.commands: getAuthors: ", result);

    return result;
  } catch (e) {
    console.error("record.commands: getAuthors: ", e);

    return undefined;
  }
}

export async function getNames(
  args: GetNamesPayload,
): Promise<string[] | undefined> {
  try {
    const result = await invoke<string[]>(Commands.GetNames, args);

    console.info("record.commands: getNames: ", result);

    return result;
  } catch (e) {
    console.error("record.commands: getNames: ", e);

    return undefined;
  }
}
