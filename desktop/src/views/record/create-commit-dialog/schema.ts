// Third Party Imports
import * as v from "valibot";

export const CreateCommitSchema = v.object({
  notes: v.string(),
  title: v.optional(v.string()),
});

export type ICreateCommitSchema = v.Input<typeof CreateCommitSchema>;
