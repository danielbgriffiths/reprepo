// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import {
  ApiGeneratedAuthorCompositionMeta,
  GeneratedAuthorCompositionMeta,
} from "@/models";

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

    return {
      authorMeta: {
        fullName: result.author_meta.full_name,
        firstName: result.author_meta.first_name,
        lastName: result.author_meta.last_name,
        middle: result.author_meta.middle,
        bornAt: result.author_meta.born_at,
        diedAt: result.author_meta.died_at,
        birthRegion: result.author_meta.birth_region,
        birthCountry: result.author_meta.birth_country,
        birthCity: result.author_meta.birth_city,
        nationality: result.author_meta.nationality,
        gender: result.author_meta.gender,
        authorSummary: result.author_meta.author_summary,
      },
      compositionMeta: {
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
      },
    };
  } catch (e) {
    console.error("ai.commands: generateAuthorCompositionMeta: ", e);

    return undefined;
  }
}
