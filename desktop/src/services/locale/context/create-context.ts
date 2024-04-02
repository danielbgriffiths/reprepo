// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import {
  LocaleBindings,
  SupportedLocale,
  TranslationKey,
} from "../index.types";

export const LocaleContext = createContext<LocaleBindings>({
  store: {
    locale: SupportedLocale.EnglishUS,
  },
  setActiveLocale: (_locale: SupportedLocale) => {},
  text: (_key: TranslationKey, _args?: Record<string, any>) => "",
});
