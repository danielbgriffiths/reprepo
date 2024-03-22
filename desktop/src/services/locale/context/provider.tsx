// Third Party Imports
import i18next from "i18next";
import { createSignal } from "solid-js";

// Local Imports
import { LocaleContext } from "./create-context";
import {
  LocaleBindings,
  LocaleProviderProps,
  SupportedLocale,
  TranslationKey,
} from "../index.types";
import englishUSTranslations from "../translations/en-US.json";

export function LocaleProvider(props: LocaleProviderProps) {
  //
  // State
  //

  const [activeLocale, setActiveLocale] = createSignal<SupportedLocale>(
    SupportedLocale.EnglishUS,
  );

  const localeBindings: LocaleBindings = [
    activeLocale,
    {
      setActiveLocale: (locale: SupportedLocale) => {
        i18next.changeLanguage(locale).catch(console.error);
        setActiveLocale(locale);
      },
      text: (key: TranslationKey, args?: Record<string, any>) => {
        return i18next.t(key, args) as string;
      },
    },
  ];

  i18next
    .init({
      lng: activeLocale(),
      fallbackLng: SupportedLocale.EnglishUS,
      debug: true,
      resources: {
        [SupportedLocale.EnglishUS]: {
          translation: englishUSTranslations,
        },
      },
    })
    .catch(console.error);

  return (
    <LocaleContext.Provider value={localeBindings}>
      {props.children}
    </LocaleContext.Provider>
  );
}
