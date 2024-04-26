// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import { ApiAuthorCompositionMeta, AuthorCompositionMeta } from "@/models";

interface GenerateUniversalRecordMetaPayload extends InvokeArgs {
  field: string;
  specialization: string;
  name: string;
  author: string;
}

export async function generateAuthorCompositionMeta(
  args: GenerateUniversalRecordMetaPayload,
): Promise<AuthorCompositionMeta | undefined> {
  try {
    const result = await invoke<ApiAuthorCompositionMeta>(
      Commands.GenerateAuthorCompositionMeta,
      args,
    );

    console.info("ai.commands: generateAuthorCompositionMeta: ", result);

    return {
      authorMeta: {
        id: result.author_meta.id,
        fullName: result.author_meta.full_name,
        firstName: result.author_meta.first_name,
        lastName: result.author_meta.last_name,
        middle: result.author_meta.middle,
        bornAt: result.author_meta.born_at,
        diedAt: result.author_meta.died_at,
        birthLocation: result.author_meta.birth_location,
        nationality: result.author_meta.nationality,
        gender: result.author_meta.gender,
        authorSummary: result.author_meta.author_summary,
        createdAt: result.author_meta.created_at,
        updatedAt: result.author_meta.updated_at,
        deletedAt: result.author_meta.deleted_at,
      },
      compositionMeta: {
        id: result.composition_meta.id,
        genre: result.composition_meta.genre,
        writtenAt: result.composition_meta.written_at,
        fullTitle: result.composition_meta.full_title,
        pieceTitle: result.composition_meta.piece_title,
        setTitle: result.composition_meta.set_title,
        numberInSet: result.composition_meta.number_in_set,
        movement: result.composition_meta.movement,
        opus: result.composition_meta.opus,
        kvv: result.composition_meta.kvv,
        n: result.composition_meta.n,
        variation: result.composition_meta.variation,
        key: result.composition_meta.key,
        workSummary: result.composition_meta.work_summary,
        createdAt: result.composition_meta.created_at,
        updatedAt: result.composition_meta.updated_at,
        deletedAt: result.composition_meta.deleted_at,
      },
    };
  } catch (e) {
    console.error("ai.commands: generateAuthorCompositionMeta: ", e);

    return undefined;
  }
}
