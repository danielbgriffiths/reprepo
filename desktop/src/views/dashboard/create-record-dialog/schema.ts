// Third Party Imports
import * as v from "valibot";

export const CreateRecordSchema = v.object({
  name: v.string(),
  author: v.string(),
  startedAt: v.string(),
});

export type ICreateRecordSchema = v.Input<typeof CreateRecordSchema>;

const FinalCreateRecordSchema = v.object({
  compositionMetaId: v.number(),
  authorMetaId: v.number(),
  startedAt: v.string(),
});

export type IFinalCreateRecordSchema = v.Input<typeof FinalCreateRecordSchema>;
