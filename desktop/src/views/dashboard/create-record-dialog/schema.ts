// Third Party Imports
import * as v from "valibot";

export const CreateRecordSchema = v.object({
  name: v.string(),
  author: v.string(),
  startedAt: v.string(),
});

export type ICreateRecordSchema = v.Input<typeof CreateRecordSchema>;
