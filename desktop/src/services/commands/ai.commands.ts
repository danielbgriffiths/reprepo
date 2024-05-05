// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import {
  ApiGeneratedAuthorCompositionMeta,
  GeneratedAuthorCompositionMeta,
} from "@/models";
import { toCamel } from "@/utils";

interface GenerateUniversalRecordMetaPayload extends InvokeArgs {
  field: string;
  specialization: string;
  name: string;
  author: string;
}

export async function generateAuthorCompositionMeta(
  args: GenerateUniversalRecordMetaPayload,
): Promise<GeneratedAuthorCompositionMeta | undefined> {
  try {
    const result = await invoke<ApiGeneratedAuthorCompositionMeta>(
      Commands.GenerateAuthorCompositionMeta,
      args,
    );

    console.info("ai.commands: generateAuthorCompositionMeta: ", result);

    return toCamel<GeneratedAuthorCompositionMeta>(result);
  } catch (e) {
    console.error("ai.commands: generateAuthorCompositionMeta: ", e);

    return undefined;
  }
}
