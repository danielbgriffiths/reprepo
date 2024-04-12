// Third Party Imports
import * as v from "valibot";

// Local Imports
import { LOCALE_KEYS } from "@services/locale/index.config";
import { SupportedLocale } from "@services/locale";

export const OnboardingSchema = v.object({
  locale: v.string([
    v.custom((input) => {
      console.log("valibot input: ", input);
      return LOCALE_KEYS.includes(input as SupportedLocale);
    }, "Not a supported locale."),
  ]),
  age: v.number([
    v.minValue(3, "You must be older than 3 years."),
    v.maxValue(110, "You must be younger than 110 years."),
  ]),
  avatar: v.optional(
    v.string([
      v.minLength(1, "This doesn't look like a valid file URI."),
      v.startsWith("data:image/", "This doesn't look like a valid image URI."),
      v.includes(
        ";base64,",
        "This doesn't look like a valid base64 image URI.",
      ),
    ]),
  ),
});

export type IOnboardingSchema = v.Input<typeof OnboardingSchema>;
