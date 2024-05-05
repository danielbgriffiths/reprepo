// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import {
  GeneratedAuthorMeta,
  GeneratedCompositionMeta,
  ApiRecord,
  Record,
} from "@/models";
import { toCamel, toSnake } from "@/utils";

interface CreateRecordPayload extends InvokeArgs {
  newRecord: {
    repositoryId: number;
    userId: number;
    parentId?: number;
    authorMeta: GeneratedAuthorMeta;
    compositionMeta: GeneratedCompositionMeta;
    startedAt: string;
  };
}

interface GetRecordsPayload extends InvokeArgs {
  targetRepositoryId: number;
}

interface GetRecordByIdPayload extends InvokeArgs {
  targetRecordId: number;
}

export async function createRecord(
  args: CreateRecordPayload,
): Promise<number | undefined> {
  try {
    const result = await invoke<number>(Commands.CreateRecord, {
      newRecord: toSnake(args.newRecord),
    });

    console.info("record.commands: createRecord: ", result);

    return result;
  } catch (e) {
    console.error("record.commands: createRecord: ", e);

    return undefined;
  }
}

export async function getRecords(
  args: GetRecordsPayload,
): Promise<Record[] | undefined> {
  try {
    const result = await invoke<ApiRecord[]>(Commands.GetRecords, args);

    console.info("record.commands: getRecords: ", result);

    return toCamel<Record[]>(result);
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

    return toCamel<Record>(result);
  } catch (e) {
    console.error("record.commands: getRecordById: ", e);

    return undefined;
  }
}
