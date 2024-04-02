// Third Party Imports
import { JSXElement } from "solid-js";

export type LocaleBindings = {
  store: LocaleStore;
  setActiveLocale: (nextLocale: SupportedLocale) => void;
  text: (key: TranslationKey, args?: Record<string, any>) => string;
};

export interface LocaleProviderProps {
  children: JSXElement;
}

export enum SupportedLocale {
  EnglishUS = "en-US",
}

export enum TranslationKey {
  SplashWelcome = "splash.welcome",
}

export interface LocaleStore {
  locale: SupportedLocale;
}
