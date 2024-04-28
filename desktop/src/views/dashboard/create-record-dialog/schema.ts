// Third Party Imports
import * as v from "valibot";

// Local Imports
import { GeneratedAuthorMeta, GeneratedCompositionMeta } from "@/models";

export const CreateRecordSchema = v.object({
  name: v.string(),
  author: v.string(),
  startedAt: v.string(),
});

export type ICreateRecordSchema = v.Input<typeof CreateRecordSchema>;

const FinalCreateRecordSchema = v.object({
  compositionMeta: v.any(),
  authorMeta: v.any(),
  startedAt: v.string(),
});

export type IFinalCreateRecordSchema = v.Input<
  typeof FinalCreateRecordSchema
> & {
  compositionMeta: GeneratedCompositionMeta;
  authorMeta: GeneratedAuthorMeta;
};
