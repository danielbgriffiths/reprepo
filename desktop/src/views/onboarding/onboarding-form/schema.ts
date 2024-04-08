import * as v from "valibot";

export const OnboardingSchema = v.object({
  locale: v.string(),
  age: v.number(),
  avatar: v.optional(v.string()),
  isOnboarded: v.boolean(),
});

export type IOnboardingSchema = v.Input<typeof OnboardingSchema>;
