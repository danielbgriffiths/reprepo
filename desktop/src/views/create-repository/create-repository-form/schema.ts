// Third Party Imports
import * as v from "valibot";

// Local Imports
import {
  FIELD_OPTIONS,
  SPECIALIZATION_OPTIONS,
} from "@views/create-repository/create-repository-form/config.ts";

export const CreateRepositorySchema = v.object({
  field: v.string([
    v.custom((input) => {
      return FIELD_OPTIONS.map((f) => f.value).includes(input);
    }, "Not a supported field."),
  ]),
  specialization: v.string([
    v.custom((input) => {
      return SPECIALIZATION_OPTIONS.get("music")
        .map((f: any) => f.value)
        .includes(input);
    }, "Not a supported specialization for the selected field."),
  ]),
  isPrivate: v.optional(v.string()),
  startDate: v.string(),
  description: v.optional(v.string()),
  name: v.string(),
});

export type ICreateRepositorySchema = v.Input<typeof CreateRepositorySchema>;
