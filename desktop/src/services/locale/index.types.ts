// Third Party Imports
import { Accessor, JSXElement } from "solid-js";

export type LocaleBindings = [
  Accessor<SupportedLocale>,
  {
    setActiveLocale: (nextLocale: SupportedLocale) => void;
    text: (key: TranslationKey, args?: Record<string, any>) => string;
  },
];

export interface LocaleProviderProps {
  children: JSXElement;
}

export enum SupportedLocale {
  EnglishUS = "en-US",
}

export enum TranslationKey {
  SplashWelcome = "splash.welcome",
}
