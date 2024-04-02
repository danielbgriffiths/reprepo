// Third Party Imports
import i18next from "i18next";
import { createStore } from "solid-js/store";

// Local Imports
import { LocaleContext } from "./create-context";
import {
  LocaleStore,
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

  const [store, setStore] = createStore<LocaleStore>({
    locale: SupportedLocale.EnglishUS,
  });

  //
  // Lifecycle
  //

  const localeBindings: LocaleBindings = {
    store,
    setActiveLocale: (locale: SupportedLocale) => {
      i18next.changeLanguage(locale).catch(console.error);
      setStore("locale", locale);
    },
    text: (key: TranslationKey, args?: Record<string, any>) => {
      return i18next.t(key, args) as string;
    },
  };

  i18next
    .init({
      lng: store.locale,
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
