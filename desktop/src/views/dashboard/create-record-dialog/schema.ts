// Third Party Imports
import * as v from "valibot";

export const CreateRecordSchema = v.object({
  name: v.string(),
  author: v.string(),
  category: v.string(),
  authoredAt: v.optional(v.string()),
  startedAt: v.optional(v.string()),
});

export type ICreateRecordSchema = v.Input<typeof CreateRecordSchema>;
