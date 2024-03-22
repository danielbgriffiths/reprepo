// Local Imports
import { SupportedLocale } from "@services/locale/index.types";

export const LOCALE_MAP: { [k in SupportedLocale]: string } = {
  [SupportedLocale.EnglishUS]: "English (US)",
};

export const LOCALE_KEYS = Object.keys(LOCALE_MAP) as SupportedLocale[];
