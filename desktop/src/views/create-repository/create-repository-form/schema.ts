import * as v from "valibot";

export const CreateRepositorySchema = v.object({
  field: v.string([
    v.minLength(1, "Please enter your email."),
    v.email("The email address is badly formatted."),
  ]),
  specialization: v.string([
    v.minLength(1, "Please enter your password."),
    v.minLength(8, "You password must have 8 characters or more."),
  ]),
  isPrivate: v.boolean(),
});

export type ICreateRepositorySchema = v.Input<typeof CreateRepositorySchema>;
